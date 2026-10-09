# Analytics e consentimento

## Resumo

O Google Tag Manager (`GTM-WBNHKVGV`) só é carregado depois que o visitante
permite métricas. Sem consentimento, nenhuma requisição é feita para
`googletagmanager.com` ou `google-analytics.com`.

O GA4 não é configurado no código. Toda tag de medição vive no container GTM.

## Arquivos

| Arquivo | Papel |
|---|---|
| `src/lib/analytics.ts` | Lê/salva consentimento, declara o Consent Mode v2, carrega o GTM uma única vez, limpa cookies ao revogar |
| `src/components/shared/PrivacyConsent.tsx` | Aviso não modal com as duas escolhas, reaberto pelo footer ou pela Home |
| `src/components/layout/Footer.tsx` | Botão "Preferências de privacidade" (`/leves`, `/pesados`, `/orcamento`, 404) |
| `src/pages/Home.tsx` | Botão "Privacidade" na faixa inferior da Home (`/`) |
| `src/main.tsx` | Chama `initAnalytics()` no boot (carrega o GTM apenas se já houver `granted`) |
| `.env.example` | `VITE_GTM_ID` |

## Configuração do container no código

`VITE_GTM_ID` define o container:

- não definido: usa `GTM-WBNHKVGV`;
- vazio (`VITE_GTM_ID=`): GTM desativado;
- valor fora do formato `GTM-XXXX`: GTM desativado.

## Estados de consentimento

Chave no `localStorage`: `bonitoscar_analytics_consent`.

| Estado | Comportamento |
|---|---|
| ausente | Aviso visível. GTM não carrega. |
| `granted` | GTM carrega uma vez por carregamento de página, inclusive nas visitas seguintes. |
| `denied` | Aviso oculto. GTM não carrega nas visitas seguintes. |

Se o `localStorage` estiver indisponível (modo privado restrito, dados de site
bloqueados), a escolha explícita é mantida em memória e vale para a página
atual, inclusive na navegação entre rotas: aceitar carrega o GTM, recusar
mantém o bloqueio. Ao recarregar, a memória se perde e o site volta ao estado
seguro (aviso visível, GTM não carregado). Nenhum identificador de usuário é
criado pelo site.

## Consent Mode v2

O bloqueio principal é não carregar o GTM sem aceite. Quando há aceite, antes
do evento `gtm.js` o site enfileira no `dataLayer`, nesta ordem:

```js
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
})
gtag('set', 'ads_data_redaction', true)
gtag('consent', 'update', { analytics_storage: 'granted' })
dataLayer.push({ 'gtm.start': ..., event: 'gtm.js' })
```

Os comandos são `Arguments` (formato gtag), o único que o GTM interpreta como
comando de consentimento. Como ficam antes de `gtm.js`, o GTM aplica o estado
antes de disparar qualquer tag. Sinais de publicidade nunca são concedidos.

### Comandos gtag na página × APIs nativas do GTM

O Google documenta dois caminhos para o consentimento com GTM:

| Caminho | Onde roda | Quando usar |
|---|---|---|
| Comandos `gtag('consent', ...)` enfileirados no `dataLayer` antes do container | Código do site | Implementação própria, sem CMP. **É o caminho usado aqui.** |
| APIs de modelo `setDefaultConsentState` / `updateConsentState` / `gtagSet` | Modelo personalizado (ex.: CMP) no acionador *Consent Initialization - All Pages* | Quando uma CMP gerencia o consentimento dentro do GTM |

Regras do caminho adotado, conforme a documentação:

- o `default` precisa ser o primeiro comando de consentimento; um `update`
  recebido antes dele é descartado. Aqui o `default` vem imediatamente antes
  do `update` e ambos antes do `gtm.js`;
- o estado não persiste entre páginas: o site o declara em todo carregamento
  em que o GTM é iniciado;
- `wait_for_update` não é usado porque o GTM só carrega com a decisão já
  tomada.

Consequências para o container:

- **não** adicionar modelo de CMP nem tag de consentimento no acionador
  *Consent Initialization*: criaria uma segunda fonte de estado;
- se no futuro uma CMP for adotada, migrar o consentimento para ela e remover
  os comandos de `src/lib/analytics.ts` no mesmo PR.

Na revogação, com o GTM ativo, o site envia
`gtag('consent', 'update', { analytics_storage: 'denied' })`, limpa os cookies
e recarrega a página.

## Configuração necessária no GTM

1. **Admin → Configurações do container → Ativar visão geral de consentimento.**
2. **Tag Google (GA4)** com o ID de medição `G-XXXXXXXXXX`:
   - acionador **Initialization - All Pages**. Não é preciso tag de
     consentimento no acionador *Consent Initialization*: o estado já chega
     antes do `gtm.js`;
   - em **Configurações avançadas → Configurações de consentimento**:
     "Exigir consentimento adicional" com `analytics_storage` (proteção extra
     caso o container seja usado fora deste fluxo).
3. **Não criar** uma segunda tag `page_view` nem acionador de "Alteração de
   histórico" para page views enquanto a medição otimizada estiver ativa
   (ver SPA abaixo). Isso duplica page views.
4. **Não adicionar** tags de Google Ads, Floodlight, Meta, remarketing ou
   vinculador de conversões: o consentimento coletado é apenas de métricas.
5. Não criar variáveis que leiam campos de formulário, texto de links `wa.me`
   com mensagem, telefone ou parâmetros de URL com dados pessoais.
6. No GA4 (**Admin → Fluxos de dados → Web → Medição otimizada**): manter
   "Visualizações de página" com "Mudanças de página baseadas em eventos do
   histórico do navegador" ativada. Desativar "Interações com formulários"
   (o site não envia conteúdo de formulário e o evento não agrega valor agora).

## SPA, page_view e document.title

O site é uma SPA (React Router). Não há `page_view` manual no código.

Quem envia os page views é a medição otimizada do GA4: um na carga da página e
um a cada `history.pushState`/`popstate`.

**Risco medido no código (Chromium):** no instante do `pushState`, inclusive
no microtask seguinte, `document.title` ainda é o da rota anterior. O título
novo (aplicado por `applyRouteSeo` em `src/App.tsx`) só está disponível a partir
do próximo frame (`requestAnimationFrame` / `setTimeout(0)`). Se o GA4 ler o
título de forma síncrona no `pushState`, o `page_title` das navegações
internas chegará com o título da página anterior. `page_location` não é
afetado. A primeira página da visita e o recarregamento não são afetados.

Isto precisa ser confirmado com o GA4 real (teste 3 abaixo). Se confirmado,
a correção planejada é: desativar a medição de histórico no GA4 e disparar um
evento `page_view` pelo GTM a partir de um evento do `dataLayer` enviado depois
de `applyRouteSeo`. Não implementar antes da confirmação.

## Revogação e cookies

Ao revogar (`granted` → `denied`), o site remove em melhor esforço apenas os
cookies do Google Analytics: `_ga`, `_ga_*`, `_gid` e `_gat*`, com `path=/`.
Os demais cookies (inclusive `_gcl_*`/`_gac_*` do Google Ads, que não são
gravados com `ad_storage` negado) não são tocados.

Domínios tentados, limitados ao domínio registrável do site
(`SITE_COOKIE_DOMAIN = 'bonitoscar.com.br'` em `src/lib/analytics.ts`):

| Host | Domínios |
|---|---|
| `www.bonitoscar.com.br` | host-only, `.www.bonitoscar.com.br`, `.bonitoscar.com.br` |
| `bonitoscar.com.br` | host-only, `.bonitoscar.com.br` |
| outro host (preview, localhost) | host-only e `.<host>` |

Sufixos públicos como `.com.br` nunca são usados. Se o domínio do site mudar,
atualizar `SITE_COOKIE_DOMAIN`.

Limitações:

- cookies `HttpOnly` (ex.: `FPID` de tagging server-side) não podem ser
  apagados por JavaScript; não são usados hoje;
- cookies gravados com `path` diferente de `/` (configuração `cookie_path`
  personalizada no GTM) não são removidos; o padrão do GA4 é `/`;
- cookies em domínios do Google (terceiros) não são acessíveis ao site; com
  `ad_storage` negado, o GA4 não os utiliza;
- em hosts de preview fora de `bonitoscar.com.br`, cookies que o GA4 tenha
  gravado num domínio pai do host não são removidos;
- dados já enviados ao GA4 antes da revogação permanecem na propriedade
  (retenção configurada no GA4).

## Testes reais pendentes (produção ou staging com GTM publicado)

O ambiente de desenvolvimento usado não alcança domínios do Google, então os
itens abaixo só podem ser validados com o container real:

1. **Bloqueio:** janela anônima, DevTools → Network filtrando `google`:
   nenhuma requisição antes da escolha e após "Continuar sem métricas".
2. **Consentimento no Tag Assistant (GTM Preview):** após "Permitir
   métricas", os comandos aparecem como eventos *Consent* antes de *Consent
   Initialization*. Na aba *Consent* do evento *Initialization*: coluna
   *On-page Default* com tudo `Denied`, *On-page Update* com
   `analytics_storage: Granted` e *Current State* com `analytics_storage`
   `Granted` e `ad_storage`, `ad_user_data`, `ad_personalization` `Denied`.
   A tag GA4 deve aparecer como disparada com a verificação de consentimento
   atendida.
3. **SPA no GA4 DebugView:** navegar `/` → `/leves` → `/pesados` →
   `/orcamento` e voltar com o botão do navegador. Para cada navegação:
   exatamente 1 `page_view`, `page_location` correto, `page_title` da rota
   nova, sem duplicidade.
4. **Revogação:** após aceitar, conferir em DevTools → Application → Cookies
   os cookies `_ga` e `_ga_*` em `.bonitoscar.com.br`; revogar pelo footer ou
   pela Home e confirmar que sumiram e que nenhuma requisição ao Google ocorre
   após o reload.
5. **Tempo real do GA4:** a visita aparece somente após o aceite.

## CSP

Hoje não há Content-Security-Policy no `.htaccess` nem no HTML. Se uma CSP for
adicionada, liberar:

- `script-src https://www.googletagmanager.com`
- `connect-src https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com`
- `img-src https://*.google-analytics.com https://www.googletagmanager.com`
