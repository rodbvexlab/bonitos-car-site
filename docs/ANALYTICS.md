# Analytics e consentimento

## Resumo

O Google Tag Manager (`GTM-WBNHKVGV`) só é carregado depois que o visitante
permite métricas. Sem consentimento, nenhuma requisição é feita para
`googletagmanager.com` ou `google-analytics.com`.

O GA4 não é configurado no código. Toda tag de medição vive no container GTM.

## Arquivos

| Arquivo | Papel |
|---|---|
| `src/lib/analytics.ts` | Lê/salva consentimento, carrega o GTM uma única vez, limpa cookies do GA ao revogar |
| `src/components/shared/PrivacyConsent.tsx` | Aviso não modal com as duas escolhas, reaberto pelo footer |
| `src/components/layout/Footer.tsx` | Botão "Preferências de privacidade" |
| `src/main.tsx` | Chama `initAnalytics()` no boot (carrega o GTM apenas se já houver `granted`) |
| `.env.example` | `VITE_GTM_ID` |

## Configuração

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

Revogação (`granted` → `denied` pelo footer): salva `denied`, remove em melhor
esforço os cookies `_ga`, `_ga_*`, `_gid` e `_gat*` e recarrega a página.
Depois do reload o GTM não é carregado.

Se o `localStorage` estiver indisponível (modo privado restrito, dados de site
bloqueados), a escolha vale apenas para a página atual e o aviso volta na
próxima visita. Nenhum identificador de usuário é criado pelo site.

Ao carregar o GTM, o site declara o Consent Mode com `analytics_storage`
concedido e `ad_storage`, `ad_user_data` e `ad_personalization` negados: o
visitante consentiu apenas com métricas.

## Privacidade

O site não envia ao `dataLayer` telefone, mensagens de WhatsApp, dados do
formulário de orçamento, texto digitado ou qualquer dado pessoal. Ao configurar
tags no GTM, não use variáveis que leiam campos de formulário, texto de cliques
em links `wa.me` com mensagem ou parâmetros de URL com dados pessoais.

## SPA e page_view — validação pendente

O site é uma SPA (React Router). Não há `page_view` manual no código.

Depois de configurar a tag GA4 no GTM, validar que a medição otimizada
"Mudanças de página baseadas em eventos do histórico do navegador" registra a
navegação. No GTM Preview + GA4 DebugView, navegar entre:

- `/`
- `/leves`
- `/pesados`
- `/orcamento`

e confirmar, para cada navegação:

1. exatamente 1 `page_view`;
2. `page_location` com a URL nova;
3. `page_title` correspondente à rota nova (o título é atualizado por
   `applyRouteSeo` logo após a troca de rota);
4. nenhum `page_view` duplicado (ex.: tag GA4 + gatilho de History Change no GTM).

Se algum item falhar, registrar como etapa futura. Não implementar `page_view`
manual sem essa validação.

## CSP

Hoje não há Content-Security-Policy no `.htaccess` nem no HTML. Se uma CSP for
adicionada, liberar:

- `script-src https://www.googletagmanager.com`
- `connect-src https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com`
- `img-src https://*.google-analytics.com https://www.googletagmanager.com`
