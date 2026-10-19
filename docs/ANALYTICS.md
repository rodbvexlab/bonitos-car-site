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
2. **Tag Google (GA4)** com o ID de medição `G-ELNK9H8X1Z`:
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

## Eventos comerciais — Sprint 02B

O site envia eventos próprios ao `dataLayer` somente quando `analytics_storage`
foi autorizado e o GTM já foi inicializado. O helper central em
`src/lib/analytics.ts` também confere o consentimento antes de cada envio.
Sem aceite, uma interação não cria `dataLayer` nem é enfileirada para envio
posterior. Os handlers rodam somente em cliques/ações reais, nunca em render ou
efeitos do React.

O payload usa apenas estes campos: `event`, `page_type`, `vehicle_type`,
`cta_location` e `cta_name`. `service_type` está reservado e só deve ser
adicionado quando uma ação representar um serviço específico. Valores atuais
de `vehicle_type`: `leves` e `pesados`; `page_type`: `home`, `leves`,
`pesados`, `orcamento` e `not_found`. Campos contextuais sem valor conhecido
são omitidos. Nenhum valor de formulário, telefone, nome, descrição ou texto de
URL/mensagem do WhatsApp é enviado.

### Inventário de interações comerciais

| Componente / ponto | Rota | Ação | Evento e contexto |
|---|---|---|---|
| Cards de categoria da Home | `/` | Abrir serviços de veículos leves ou pesados | `service_cta_click`; `home_service_card`; `vehicle_type` conforme card |
| Header, navegação desktop e menu mobile | Todas | Abrir página Leves ou Pesados | `service_cta_click`; `header_desktop` ou `header_mobile_menu` |
| CTA de orçamento no header desktop/mobile | Todas | Abrir `/orcamento` | `quote_start`; localização do header |
| CTA inferior da Home | `/` | Abrir `/orcamento` | `quote_start`; `home_footer` |
| Botão “Solicitar Avaliação” | `/leves`, `/pesados` | Abrir formulário com a categoria selecionada | `quote_start`; `service_hero`; veículo correspondente |
| CTA de orçamento da seção final | `/leves`, `/pesados` | Abrir `/orcamento` | `quote_start`; `service_cta_section`; veículo correspondente |
| WhatsApp do header desktop e menu mobile | Todas | Abrir conversa externa | `whatsapp_click`; localização do header; contexto da rota |
| WhatsApp do hero e da seção final | `/leves`, `/pesados` | Abrir conversa externa | `whatsapp_click`; hero ou seção CTA; veículo correspondente |
| WhatsApp flutuante | `/leves`, `/pesados`, `/orcamento`, 404 | Abrir conversa externa | `whatsapp_click`; `floating_whatsapp`; contexto da rota |
| Número no footer | Todas | Abrir conversa externa via WhatsApp | `whatsapp_click`; `footer_contact` |
| Formulário de orçamento válido | `/orcamento` | Montar mensagem e abrir WhatsApp | `whatsapp_click`; `quote_form`; veículo selecionado |
| Links de navegação do footer | Todas | Abrir Leves, Pesados ou Orçamento | `service_cta_click` para categoria; `quote_start` para Orçamento |
| Links telefônicos (`tel:`) | Nenhuma | Não há link telefônico acionável no código atual | `phone_click` não é emitido; reavaliar se um link `tel:` for adicionado |
| Envio de orçamento para backend | Nenhuma | O formulário abre WhatsApp, sem envio verificável ao servidor | `quote_submit` não é emitido |

Os botões de categoria na Home e navegação para as páginas de serviço não são
eventos de orçamento. `quote_start` representa clique explícito em um CTA que
abre o formulário. O botão final do formulário é medido como
`whatsapp_click`, após validação local; não se registra envio/recebimento de
mensagem nem conversão concluída.

### Configuração no GTM (sem publicação pelo repositório)

No container `GTM-WBNHKVGV` (GA4 `G-ELNK9H8X1Z`), criar variáveis do tipo
**Variável da camada de dados**, versão 2:

| Nome sugerido | Chave da camada de dados |
|---|---|
| `DLV - page_type` | `page_type` |
| `DLV - vehicle_type` | `vehicle_type` |
| `DLV - cta_location` | `cta_location` |
| `DLV - cta_name` | `cta_name` |
| `DLV - service_type` | `service_type` (reservada; ainda não enviada) |

Criar um acionador **Evento personalizado** para cada evento abaixo, com o
nome exato e correspondência sensível a maiúsculas/minúsculas:

| Acionador | Evento personalizado |
|---|---|
| `CE - whatsapp_click` | `whatsapp_click` |
| `CE - quote_start` | `quote_start` |
| `CE - service_cta_click` | `service_cta_click` |

Criar uma tag **Google Analytics: evento do GA4** para cada acionador. Usar a
Google tag/ID `G-ELNK9H8X1Z`, nomear cada evento com o mesmo nome do acionador e
mapear os parâmetros:

| Parâmetro do GA4 | Variável GTM |
|---|---|
| `page_type` | `{{DLV - page_type}}` |
| `vehicle_type` | `{{DLV - vehicle_type}}` |
| `cta_location` | `{{DLV - cta_location}}` |
| `cta_name` | `{{DLV - cta_name}}` |

Adicionar `service_type` somente quando o código passar a enviar essa
classificação. Exigir `analytics_storage` nas configurações de consentimento
de cada tag GA4 como salvaguarda adicional. A decisão primária continua sendo
do site: ele não carrega GTM sem aceite; no aceite, declara os sinais do
Consent Mode v2 antes de `gtm.js`. Não criar outra tag de consentimento,
acionador para `All Pages`/histórico, nem tag de `quote_submit` ou `phone_click`
sem uma ação real correspondente. Revisar no Preview e publicar o container
manualmente após revisão; este trabalho não altera nem publica o GTM.

### Matriz de QA comercial

| Cenário | Desktop | Mobile | Resultado esperado | Execução local |
|---|---|---|---|
| Sem escolha de consentimento ou com recusa | Home → Leves | Não executado | Sem requisição ao GTM e sem eventos comerciais no `dataLayer` | Passou no desktop; GTM/dataLayer ausentes antes e depois da recusa |
| Aceite e um clique em CTA de serviço | Card Leves na Home | Não executado | Exatamente um `service_cta_click` com rota, veículo e localização coerentes | Passou no desktop; payload conferido |
| Aceite e um clique em CTA de orçamento | Header → `/orcamento` | Não executado | Exatamente um `quote_start`; navegação para `/orcamento` continua funcionando | Passou no desktop; evento único e veículo coerente |
| Aceite e um clique em WhatsApp | Hero Leves | Menu mobile na Home | Exatamente um `whatsapp_click`; abertura externa preservada | Passou em ambos; evento único e localização correta |
| Formulário válido | Não executado | `/orcamento?cat=leves` | Um `whatsapp_click`; nenhum campo pessoal aparece no objeto de evento | Passou no mobile; payload sem dados pessoais, sem `quote_submit` |
| Página com número de contato | Nenhum link existente | Nenhum link existente | Nenhum `phone_click`; não existe link `tel:` hoje | Passou; busca no código não encontrou `tel:` acionável |
| Navegação SPA entre rotas | Home → Leves → Orçamento | Não executado | Navegação funcional; `page_view` segue somente a medição otimizada do GA4 | Passou no desktop; nenhum `page_view` manual no `dataLayer` |
| Build | `npm run build` | Não aplicável | TypeScript e build Vite sem erros | Passou |

O teste local pode bloquear a requisição externa do GTM e inspecionar o
`dataLayer`; a confirmação de coleta real, consentimento no Tag Assistant e
`page_view` continua dependendo do container/staging/GA4 publicados. Não
duplicar a medição otimizada com tags manuais de `page_view`.

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
