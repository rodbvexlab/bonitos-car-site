param(
    [string]$ProjectRoot = "C:\Sites\Bonitos Car - Site"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ensure-Directory {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        New-Item -ItemType Directory -Path $Path -Force | Out-Null
        Write-Host "Criado diretório: $Path" -ForegroundColor Green
    }
    else {
        Write-Host "Diretório já existe: $Path" -ForegroundColor Yellow
    }
}

function Write-Utf8File {
    param(
        [string]$Path,
        [string]$Content
    )

    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
    Write-Host "Arquivo criado/atualizado: $Path" -ForegroundColor Cyan
}

if (-not (Test-Path -LiteralPath $ProjectRoot)) {
    throw "O diretório do projeto não foi encontrado: $ProjectRoot"
}

$agentRoot  = Join-Path $ProjectRoot ".agent"
$skillsRoot = Join-Path $agentRoot "skills"

Ensure-Directory -Path $agentRoot
Ensure-Directory -Path $skillsRoot

$skills = @(
    @{
        Name = "bonitoscar-frontend-foundation"
        Description = "Skill mãe do projeto Bonitos Car. Define linguagem visual, arquitetura de experiência, conversão e comportamento premium do front-end."
        Content = @'
---
name: bonitoscar-frontend-foundation
description: Use esta skill ao criar, evoluir ou refinar o front-end do site da Bonitos Car. A skill define a linguagem visual, a arquitetura de experiência, os princípios de conversão e o comportamento de interface para um site premium, imersivo, moderno e responsivo, com entrada principal baseada na escolha entre Leves e Pesados.
---

# Bonitos Car — Frontend Foundation

## Missão
Criar uma experiência digital premium, imersiva e comercialmente forte para a Bonitos Car, substituindo a estética antiga do site atual por uma presença moderna, cinematográfica, responsiva e orientada à conversão.

O site deve ser percebido como:
- confiável
- robusto
- moderno
- premium
- técnico
- visualmente memorável

O site não deve parecer:
- genérico
- institucional comum
- datado
- amador
- poluído
- exagerado sem estratégia

---

## Contexto do projeto
A Bonitos Car atua com funilaria e pintura para duas frentes principais:
- Leves: carros, automóveis e utilitários
- Pesados: caminhões, linha pesada e serviços estruturais

A nova experiência deve começar por uma decisão clara de jornada:
- Categoria Leves
- Categoria Pesados

Essa decisão é o núcleo da home.

---

## Objetivo principal da experiência
O visitante deve entrar no site e, em poucos segundos:
1. perceber valor
2. entender que a empresa atende duas categorias
3. escolher seu tipo de veículo
4. entrar em uma página específica
5. ser conduzido a orçamento e WhatsApp

A experiência precisa ser visualmente forte, mas rápida de entender.

---

## Princípios não negociáveis

### 1. Clareza acima do efeito
Todo movimento precisa ajudar a navegação, reforçar hierarquia ou aumentar percepção premium.
Animação nunca pode atrapalhar leitura, decisão ou performance percebida.

### 2. Impacto com controle
O site deve ter presença visual marcante, mas sem virar espetáculo caótico.
A estética deve ser elegante, técnica e segura.

### 3. Conversão sempre visível
WhatsApp, orçamento e contato devem estar integrados à jornada de forma natural e constante.

### 4. Segmentação real
Leves e Pesados não são apenas duas seções. São duas jornadas com identidade, copy e atmosfera próprias.

### 5. Responsividade inteligente
A experiência desktop pode ser mais cinematográfica.
No mobile, a lógica deve permanecer forte, mas com simplificação de layout e priorização absoluta da clareza.

---

## Direção visual

### Sensação geral
- premium automotivo/industrial
- cinematográfico
- dark mode elegante
- moderno
- editorial
- imersivo
- sofisticado
- robusto

### Base cromática
- preto profundo
- grafite
- chumbo
- cinza metálico
- branco gelo para contraste
- acentos em vermelho queimado, cobre ou laranja industrial, usados com moderação

### Evitar
- branco dominante
- vermelho excessivo e agressivo
- visual de oficina popular
- degradês pesados e genéricos
- brilho neon exagerado
- elementos caricatos
- aparência de template barato

---

## Tipografia
A tipografia deve comunicar força, sofisticação e legibilidade.

Direção tipográfica:
- títulos com presença forte, larga ou condensada, aparência premium e industrial
- subtítulos limpos e firmes
- textos corridos com ótima leitura e espaçamento generoso
- contraste claro entre heading, supporting text e CTA

A tipografia deve parecer parte do posicionamento da marca, não apenas um texto funcional.

---

## Linguagem visual inspiradora
A interface deve combinar:
- composição editorial
- grids amplos
- áreas com respiro
- motion suave com profundidade
- sobreposição de imagem, luz, sombra e textura
- blocos com sensação premium
- transições de categoria com narrativa visual

A estética pode absorver referências de sites modernos com forte motion design, desde que a usabilidade continue objetiva.

---

## Arquitetura da experiência

### Home principal
A home deve funcionar como uma entrada imersiva e decisória.

Estrutura desejada:
1. hero de entrada full screen
2. escolha entre Leves e Pesados
3. transição refinada para a categoria
4. prova de especialização
5. galeria ou bloco de transformação
6. CTA para orçamento
7. bloco de confiança local
8. contato/rodapé

### Página Leves
Deve comunicar:
- funilaria e pintura automotiva
- acabamento
- cuidado visual
- recuperação premium
- carros, automóveis e utilitários

### Página Pesados
Deve comunicar:
- funilaria e pintura de caminhões
- robustez operacional
- estrutura
- linha pesada
- reparo técnico e recuperação visual/estrutural

### Página Orçamento
Deve ser simples, direta e confiável.
Campos enxutos, boa hierarquia e CTA forte.
Sempre prever integração com WhatsApp.

### Página Antes e Depois
A galeria deve transmitir transformação real.
Nada de grade simples sem narrativa.
Priorizar comparação visual e valorização do resultado final.

---

## Componente principal da home

### Category Gateway
Este é o componente central da experiência.

Objetivo:
Fazer o usuário escolher rapidamente entre Leves e Pesados em uma interface cinematográfica.

Direção:
- split-screen premium ou composição equivalente
- cada lado com identidade visual própria
- hover com destaque, profundidade e leitura mais clara
- texto curto, forte e orientado à ação
- CTA explícito
- transição elegante ao selecionar

Desktop:
- split screen ou composição dual com forte contraste de atmosfera

Mobile:
- não usar split extremamente apertado
- adaptar para dois blocos empilhados ou cards grandes verticais
- preservar a sensação premium sem comprometer clique e leitura

---

## Motion e microinterações

### O motion deve:
- reforçar hierarquia
- aumentar imersão
- sinalizar interação
- deixar a experiência refinada

### O motion não deve:
- atrasar a navegação
- esconder CTA
- comprometer legibilidade
- gerar fadiga visual

### Recomendações de comportamento
- entradas suaves e progressivas
- hover com profundidade, luz e pequeno deslocamento
- parallax sutil
- transições entre categorias com sensação cinematográfica
- reveal on scroll com discrição
- animações de texto e imagem com timing elegante
- evitar carrosséis pesados e efeitos gratuitos

---

## Sistema de conversão

### Objetivos de conversão
- iniciar conversa no WhatsApp
- solicitar orçamento
- gerar confiança
- apresentar prova real de serviço

### Regras
- CTA principal sempre visível em pontos estratégicos
- botão de WhatsApp com presença constante, mas sem ser invasivo
- cada seção precisa conduzir a um próximo passo
- textos devem reduzir fricção e passar segurança
- prova social e prova visual devem aparecer cedo

### Elementos importantes
- CTA de orçamento
- CTA de WhatsApp
- antes e depois
- marcas atendidas
- localização
- confiança operacional
- diferenciais curtos e fortes

---

## Componentes prioritários
A skill deve priorizar estes componentes como base do projeto:

1. Hero Gateway de categoria
2. Header premium com navegação limpa
3. Sticky WhatsApp CTA
4. Hero interno por categoria
5. Grid de serviços
6. Galeria antes/depois com comparação forte
7. Bloco de diferenciais
8. Bloco de marcas atendidas ou confiança
9. Formulário de orçamento
10. Rodapé forte com contato e localização

---

## Regras de UI

### Header
- elegante
- estável
- leve
- com boa leitura sobre fundos ricos
- deve parecer premium e não burocrático

### Cards
- profundidade sutil
- bons espaçamentos
- superfície escura bem trabalhada
- nada de boxes genéricos sem personalidade

### Botões
- hierarquia clara entre primário e secundário
- forte contraste
- aparência premium
- resposta visual refinada ao hover/touch

### Seções
- ritmo visual bem construído
- alternância entre blocos mais densos e blocos com respiro
- storytelling visual progressivo

---

## Regras de conteúdo
A copy deve ser:
- direta
- segura
- confiante
- profissional
- sem exagero publicitário barato

Evitar:
- textos longos demais logo na entrada
- clichês vazios
- linguagem genérica de oficina comum
- excesso de informação técnica sem necessidade

Priorizar:
- especialidade
- confiança
- qualidade do acabamento
- agilidade no atendimento
- orçamento facilitado
- experiência por categoria

---

## Responsividade
No desktop, permitir mais atmosfera, escala e profundidade.
No tablet e mobile:
- reduzir complexidade
- manter contraste e impacto
- simplificar animação
- priorizar leitura, toque e CTA
- reorganizar grids sem perder identidade premium

A versão mobile deve continuar sofisticada, mas mais objetiva.

---

## Acessibilidade e legibilidade
Sempre garantir:
- contraste suficiente
- texto legível sobre imagens
- headings claros
- áreas clicáveis confortáveis
- animações que não prejudiquem leitura
- navegação intuitiva

---

## O que evitar de forma absoluta
- aparência de template genérico
- excesso de efeitos 3D
- visual futurista desconectado do setor
- página visualmente confusa
- CTA escondido
- fundo claro dominante
- grid sem hierarquia
- carrossel antigo com cara datada
- excesso de blocos com borda aleatória
- linguagem visual sem identidade

---

## Comportamento esperado ao usar esta skill
Ao receber um pedido de criação ou refinamento de tela, a resposta deve seguir esta lógica:

1. identificar o objetivo da página ou seção
2. definir a intenção de UX
3. estruturar a hierarquia da interface
4. especificar atmosfera visual
5. detalhar motion e comportamento
6. considerar responsividade
7. orientar conversão
8. gerar prompt final pronto para uso

---

## Subskills futuras derivadas desta base
Esta skill serve como fundação para futuras skills menores, como:
- immersive-category-gateway
- automotive-service-landing
- before-after-gallery-system
- local-conversion-ui
- premium-quote-flow
'@
    },
    @{
        Name = "immersive-category-gateway"
        Description = "Subskill para a home imersiva com escolha entre Leves e Pesados."
        Content = @'
---
name: immersive-category-gateway
description: Use esta skill ao criar ou refinar a home de entrada da Bonitos Car, com tela imersiva de escolha entre Leves e Pesados, forte impacto visual, clareza comercial e motion premium.
---

# Immersive Category Gateway

## Objetivo
Criar uma home de entrada full screen que permita ao usuário escolher rapidamente entre:
- Leves
- Pesados

## Regras centrais
- priorizar clareza da escolha
- split-screen premium ou solução equivalente
- tipografia forte
- dark mode elegante
- hover sofisticado
- transição refinada após seleção
- excelente responsividade

## Entregáveis esperados
- lógica de UX da home
- estrutura visual da dobra inicial
- comportamento de motion
- adaptação mobile
- prompt final pronto para uso no Antigravity
'@
    },
    @{
        Name = "automotive-service-landing"
        Description = "Subskill para páginas de serviços das categorias Leves e Pesados."
        Content = @'
---
name: automotive-service-landing
description: Use esta skill ao criar ou refinar páginas de serviços da Bonitos Car para Leves ou Pesados, com foco em posicionamento premium, clareza de serviços, prova visual e conversão.
---

# Automotive Service Landing

## Objetivo
Estruturar páginas de categoria com:
- hero forte
- serviços claros
- diferenciais
- prova visual
- CTA de orçamento
- CTA de WhatsApp

## Direção
- forte percepção premium
- estética automotiva/industrial
- layout moderno e responsivo
- linguagem visual segura e sofisticada
'@
    },
    @{
        Name = "before-after-gallery-system"
        Description = "Subskill para galeria de antes e depois com forte valorização visual."
        Content = @'
---
name: before-after-gallery-system
description: Use esta skill ao criar ou refinar galerias de antes e depois da Bonitos Car, com foco em transformação visual, prova real de serviço e apresentação premium.
---

# Before / After Gallery System

## Objetivo
Criar uma galeria que valorize a transformação do veículo e transmita confiança.

## Direção
- comparação visual forte
- narrativa de transformação
- grid premium
- boa leitura no mobile
- CTA próximo da galeria
'@
    },
    @{
        Name = "premium-quote-flow"
        Description = "Subskill para jornada de orçamento com CTA forte e integração com WhatsApp."
        Content = @'
---
name: premium-quote-flow
description: Use esta skill ao criar ou refinar a página e o fluxo de orçamento da Bonitos Car, com formulário simples, confiança visual, CTA forte e integração com WhatsApp.
---

# Premium Quote Flow

## Objetivo
Criar uma jornada de orçamento direta, confiável e com baixa fricção.

## Regras
- poucos campos
- hierarquia visual clara
- CTA forte
- integração com WhatsApp
- adaptação para Leves e Pesados
'@
    }
)

foreach ($skill in $skills) {
    $skillDir = Join-Path $skillsRoot $skill.Name
    Ensure-Directory -Path $skillDir

    # Estrutura opcional para evolução futura
    Ensure-Directory -Path (Join-Path $skillDir "assets")
    Ensure-Directory -Path (Join-Path $skillDir "references")
    Ensure-Directory -Path (Join-Path $skillDir "scripts")

    $skillFile = Join-Path $skillDir "SKILL.md"
    Write-Utf8File -Path $skillFile -Content $skill.Content
}

$readmePath = Join-Path $skillsRoot "README.txt"
$readmeContent = @"
Estrutura de skills criada com sucesso.

Local:
$skillsRoot

Skills criadas:
- bonitoscar-frontend-foundation
- immersive-category-gateway
- automotive-service-landing
- before-after-gallery-system
- premium-quote-flow

Próximo passo recomendado:
1. Revisar os arquivos SKILL.md
2. Ajustar o conteúdo conforme o fluxo real do Antigravity
3. Criar regras globais separadamente apenas se necessário
"@
Write-Utf8File -Path $readmePath -Content $readmeContent

Write-Host ""
Write-Host "Concluído. Estrutura de skills criada em: $skillsRoot" -ForegroundColor Green