# Gestão de Comodato · Jägermeister — v4

Aplicativo interno para registrar, aprovar, contratar e acompanhar equipamentos em comodato.

O fluxo On-Trade aceita somente **Tap Machine**. Shotpoint e Freezer não aparecem em novas solicitações.

## Importação inteligente

Na primeira etapa, o BA pode consultar diretamente pelos 14 números do CNPJ ou enviar cartão CNPJ (`.pdf`), BAM/B.A Management (`.xls` ou `.xlsx`) ou arquivo `.csv`.

- A consulta pelo número usa os dados cadastrais públicos da BrasilAPI e não envia arquivo algum.
- Cartões CNPJ gerados pela Receita Federal são lidos diretamente no navegador, sem chave ou configuração.
- Planilhas e CSV também são lidos localmente no navegador e não são enviados para um servidor.
- Se houver várias casas, o app abre uma busca para escolher o cliente correto.
- O app reconhece nome da casa, razão social, CNPJ, endereço, BA, prioridade, Perfect Outlet e dados de equipamento quando essas colunas estiverem disponíveis.
- Se o owner do arquivo divergir do BA configurado no aparelho, o app mantém o BA atual e mostra um alerta para conferência.
- O cartão CNPJ preenche automaticamente nome fantasia, razão social, CNPJ, endereço, bairro, município, UF e CEP.
- Dados jurídicos ausentes no BAM continuam marcados para preenchimento manual e revisão antes do envio.
- PDFs escaneados, sem camada de texto, usam a leitura alternativa somente quando ela estiver configurada.

## Fluxo operacional

1. **Solicitação** — BA informa casa, prioridade, pilar, objetivo, oportunidade, dados jurídicos e modelo desejado.
2. **Aprovação** — gestor valida a oportunidade antes da reserva e do contrato.
3. **Reserva** — série e patrimônio identificam o equipamento destinado à casa.
4. **Contrato** — o `.docx` só é liberado depois da aprovação e com a série preenchida.
5. **Instalação** — data e foto comprovam a entrega física.
6. **Ativação** — o processo só termina quando o BAM estiver atualizado.

Status disponíveis: `Rascunho`, `Solicitado`, `Em aprovação`, `Aprovado`, `Máquina reservada`, `Contrato enviado`, `Assinado`, `Instalação agendada`, `Instalado` e `Ativo`.

## O que a v4 acrescenta

- número único por solicitação;
- prioridade e pilar territorial;
- justificativa comercial, volume estimado e Perfect Outlet atual;
- modelo, série, patrimônio e local de instalação;
- visão de processos com próxima ação;
- confirmação de instalação com foto e BAM atualizado;
- base compartilhada opcional pelo Netlify Blobs;
- PIN do time e PIN separado para aprovação do gestor;
- histórico local preservado para proteger os dados pessoais do contrato;
- limite de 8 MB no cartão CNPJ;
- estrutura de deploy corrigida e ícone PWA incluído.
- importação automática de BAM, B.A Management, CSV e cartão CNPJ;
- busca da casa em arquivos com várias linhas e proteção contra troca silenciosa de owner;
- identidade visual alinhada ao portal On-Trade.

## Privacidade

A base compartilhada guarda somente os dados operacionais do processo. CPF, e-mail e dados das pessoas que assinam continuam apenas no aparelho que criou a solicitação. Isso permite ao gestor acompanhar o fluxo sem transformar o painel operacional em uma base de dados pessoais.

## Publicação no Netlify

Conecte o repositório ao Netlify. O `netlify.toml` publica a raiz e carrega as funções em `netlify/functions`.

Configure em **Project configuration → Environment variables**:

- `ANTHROPIC_API_KEY`: leitura automática do cartão CNPJ;
- `TEAM_ACCESS_PIN`: PIN distribuído aos BAs;
- `MANAGER_PIN`: PIN restrito aos aprovadores.

As variáveis não devem ser escritas no `netlify.toml` nem enviadas ao GitHub.

## GitHub Pages

O app também abre como site estático. Nesse modo, geração de contrato, rascunho e processos funcionam localmente, mas não há sincronização entre aparelhos. A leitura de PDF usa uma chave individual opcional ou preenchimento manual.

## Estrutura

```text
index.html                      aplicativo React sem etapa de build
manifest.json                   instalação no celular
icon.svg                        ícone do aplicativo
sw.js                           funcionamento offline
netlify/functions/cnpj.js       leitura protegida do cartão CNPJ
netlify/functions/workflow.js   processos compartilhados e aprovação
netlify.toml                    configuração do deploy
package.json                    dependência do Netlify Blobs
```

## Observação jurídica

O texto-base do contrato foi preservado. A cláusula 5.3 continua com a redação já existente e deve ser alterada somente após validação do Jurídico.
