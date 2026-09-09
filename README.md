# Gestão de Comodato · Jägermeister — v4

Aplicativo interno para preparar pedidos de comodato, gerar o contrato e montar o texto do e-mail para envio pelo BA.

O fluxo On-Trade aceita somente **Tap Machine**. Shotpoint e Freezer não aparecem em novas solicitações.

## Importação inteligente

Na primeira etapa, o BA pode consultar diretamente pelos 14 números do CNPJ ou selecionar até 8 arquivos de uma vez. São aceitos cartão CNPJ, contrato social/alteração consolidada e RG, CNH ou comprovante de CPF dos representantes em `.pdf`, além de BAM/B.A Management (`.xls` ou `.xlsx`) e `.csv`.

- A consulta pelo número usa os dados cadastrais públicos da BrasilAPI e não envia arquivo algum.
- Cartões CNPJ, contratos sociais e documentos dos representantes com camada de texto são lidos diretamente no navegador, sem chave ou configuração.
- O app combina os arquivos selecionados: o CNPJ preenche a empresa e RG/CNH/CPF preenchem nome e CPF do primeiro e do segundo representante quando disponíveis.
- E-mails dos representantes continuam manuais, porque normalmente não constam nos documentos.
- RG, CNH e contrato social não são enviados para leitura externa nem armazenados pelo app.
- Planilhas e CSV também são lidos localmente no navegador e não são enviados para um servidor.
- Se houver várias casas, o app abre uma busca para escolher o cliente correto.
- O app reconhece nome da casa, razão social, CNPJ, endereço, BA, prioridade, Perfect Outlet e dados de equipamento quando essas colunas estiverem disponíveis.
- Se o owner do arquivo divergir do BA configurado no aparelho, o app mantém o BA atual e mostra um alerta para conferência.
- O cartão CNPJ preenche automaticamente nome fantasia, razão social, CNPJ, endereço, bairro, município, UF e CEP.
- Dados jurídicos ausentes no BAM continuam marcados para preenchimento manual e revisão antes do envio.
- Fotos e PDFs escaneados, sem camada de texto, exigem conferência e preenchimento manual. A leitura alternativa configurada permanece restrita ao cartão CNPJ.

## Fluxo operacional

O app automatiza **somente a preparação do pedido de comodato**. Ele não substitui o fluxo interno de aprovação da Interfood/Jägermeister.

1. **Importar cliente** — consultar CNPJ ou importar documentos/BAM.
2. **Dados do pedido** — completar e conferir casa, inscrição estadual, quantidade de máquinas, numeração de cada equipamento, representantes, testemunha e BA. A justificativa comercial é opcional e todas as Tap Machines são tratadas como 220V.
3. **Gerar** — revisar os dados, baixar o contrato em `.docx`, copiar o texto do e-mail e lembrar do contrato social/última alteração consolidada como anexo obrigatório. Para SP e RJ, o app direciona para a Junta Comercial correspondente.

Depois disso, o BA envia o e-mail e o anexo pelo canal corporativo. Aprovação, assinatura, instalação, atualização de BAM e demais etapas seguem internamente fora do app.

O número de solicitação continua sendo gerado apenas para identificar o pedido e facilitar referência no e-mail.

## Privacidade

A base compartilhada guarda somente os dados operacionais do processo. CPF, e-mail e dados das pessoas que assinam continuam apenas no aparelho que criou a solicitação. Isso permite ao gestor acompanhar o fluxo sem transformar o painel operacional em uma base de dados pessoais.

## Publicação

O app funciona como site estático no GitHub Pages. A geração do contrato, o rascunho e o texto do e-mail acontecem no navegador. Não há painel de gerente, aprovação ou acompanhamento do processo interno dentro do app.

As funções Netlify existentes no repositório são legadas da tentativa de transformar o gerador em workflow e não são necessárias para o uso principal no GitHub Pages.

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
