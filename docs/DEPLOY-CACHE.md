# Cache HTTP no deploy Hostinger

## Diagnóstico

O repositório não tinha diretivas de cache HTTP no `public/.htaccess`. Ele
define redirects canônicos e o fallback da SPA, mas a política efetiva de cache
dependia dos padrões do Apache/LiteSpeed e de qualquer camada da Hostinger/CDN.
Não há configuração de headers de cache no `vite.config.ts` nem script de
deploy no `package.json`. `vercel.json` contém apenas rewrite para a SPA e não
controla o deploy Hostinger.

O build Vite usa nomes com fingerprint/hash, como
`assets/index-Dm4A_IJI.js`, `assets/index-frSxodvY.css` e
`assets/vendor-BTy5g8tH.js`. O HTML gerado referencia esses nomes. O HTML
antigo com `index-DXsna19R.js` é evidência de que uma cópia anterior de
`index.html` ainda está sendo servida ou foi deixada no cache do navegador,
proxy ou CDN. O nome diferente do bundle, sozinho, não identifica qual camada
serviu a versão antiga; é preciso comparar a resposta do origin e a resposta
pública.

## Política adicionada

`public/.htaccess` agora define `Cache-Control: no-cache, must-revalidate` nas
respostas de conteúdo bem-sucedidas. Navegadores e caches compatíveis podem
armazená-las, mas devem revalidá-las antes de reutilizar. Isso cobre
`index.html` e as rotas da SPA, que continuam reescrevendo para o mesmo
`index.html`. Também evita cache longo de arquivos públicos sem fingerprint.

Arquivos com nome contendo o padrão de hash de oito caracteres emitido pelo
Vite recebem `Cache-Control: public, max-age=31536000, immutable`. O nome muda
quando o conteúdo do bundle muda, então um HTML atualizado aponta para novos
URLs sem invalidar os bundles já armazenados. O bloco usa `mod_headers`,
protegido por `IfModule`; o teste HTTP no host deve confirmar que o módulo está
ativo e que Hostinger/CDN respeita o header.

O uso de `Header set` (tabela normal do mod_headers) mantém as respostas de
redirect fora dessa regra de cache. As regras de rewrite não foram alteradas:
continuam valendo os redirects de
`index.html` e URLs legadas, canonicalização para HTTPS/www/sem barra final, o
fallback de `/`, `/leves`, `/pesados` e `/orcamento`, e o 404 para outras URLs.
Não foram alterados `<title>`, canonical, sitemap, robots ou código de
Analytics/Consent Mode.

## Verificações no deploy Hostinger/CDN

Não é possível inferir o estado dessas camadas a partir deste checkout. No
hPanel e no CDN ativo, confirmar:

1. O `public_html/.htaccess` publicado corresponde a `dist/.htaccess` do build
   atual. Como o arquivo é oculto, confirmar que o processo de upload o inclui.
2. Cache Manager/LiteSpeed não substitui `Cache-Control` do origin nem mantém
   regras de TTL longo para HTML. Se houver regra de cache HTML, configurá-la
   para bypass/revalidação.
3. Hostinger CDN, Cloudflare ou outro proxy não força TTL longo/“cache
   everything” para `/`, `/index.html` ou rotas SPA. Purge do HTML na publicação
   da política e quando necessário; manter o cache longo apenas em URLs com
   hash.
4. Verificar a resposta no origin e na URL pública. Se diferirem, a camada
   intermediária está usando uma regra própria. `Age`, `X-Cache` ou headers
   equivalentes podem ajudar, mas não são garantidos pela Hostinger.
5. Fazer upload dos novos assets antes de `index.html`; publicar o HTML por
   último reduz a janela em que uma página aponta para arquivos ainda ausentes.
   Confirmar que o diretório de publicação é o document root correto.

Não foi possível consultar o site de produção deste ambiente: o proxy de rede
recusou a conexão HTTPS para `www.bonitoscar.com.br` com HTTP 403 antes de
alcançar o origin. Os itens acima precisam ser verificados na conta Hostinger
ou em um ambiente com acesso ao domínio.

## Testes HTTP após publicar

Executar contra o host público após o deploy e o purge, com TLS validado:

```sh
# Home e cada rota SPA devem responder 200 e revalidar o documento HTML.
curl -sSI https://www.bonitoscar.com.br/
curl -sSI https://www.bonitoscar.com.br/leves
curl -sSI https://www.bonitoscar.com.br/pesados
curl -sSI https://www.bonitoscar.com.br/orcamento

# O HTML atual deve referenciar o bundle do deploy atual.
curl -fsS https://www.bonitoscar.com.br/ | grep -oE '/assets/[^" ]+\.(js|css)'

# Bundles Vite com hash devem ser armazenáveis por um ano.
curl -sSI https://www.bonitoscar.com.br/assets/index-Dm4A_IJI.js
curl -sSI https://www.bonitoscar.com.br/assets/index-frSxodvY.css

# Redirects/canonical e fallback/404 devem permanecer intactos.
curl -sSI http://bonitoscar.com.br/leves/
curl -sSI https://www.bonitoscar.com.br/index.html
curl -sSI https://www.bonitoscar.com.br/rota-inexistente-qa
```

Esperado: HTML com `Cache-Control: no-cache, must-revalidate`; arquivos
versionados com `Cache-Control: public, max-age=31536000, immutable`; rotas
principais com status 200; legado/canonical com redirect para HTTPS, www e
rota sem barra; caminho inexistente com 404. Confirmar que a home baixada não
contém mais `index-DXsna19R.js`. Se o CDN responder com HTML antigo após o
origin estar atualizado, verificar TTL/purge no CDN antes de alterar rotas ou
canonicals.

`curl -I` contra `vite preview` verifica o servidor local e as rotas, mas não
interpreta `.htaccess`; não é prova dos headers do Apache/LiteSpeed. O build
confirma que Vite copia `public/.htaccess` para `dist/.htaccess`.

## Rollback

Se os headers causarem erro HTTP ou incompatibilidade no servidor:

1. Remover somente o bloco `Cache-Control` protegido por `IfModule` do
   `public/.htaccess`; preservar todas as regras de redirect e rewrite abaixo.
2. Gerar um novo build e publicar `dist/.htaccess` no document root.
3. Purgar o cache HTML do CDN/Hostinger e repetir os testes de status, rotas e
   canonical acima.

Rollback no servidor: restaurar a cópia anterior do `.htaccess` preservada
antes do deploy. Não apagar assets nem editar regras de canonicalização durante
esse rollback.
