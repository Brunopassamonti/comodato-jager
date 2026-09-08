# Gestão de Comodato · Jägermeister — v3

Aplicativo interno para registrar, aprovar, contratar e acompanhar equipamentos em comodato.

## Fluxo operacional

1. **Solicitação** — BA informa casa, prioridade, pilar, objetivo, oportunidade, dados jurídicos e modelo desejado.
2. **Aprovação** — gestor valida a oportunidade antes da reserva e do contrato.
3. **Reserva** — série e patrimônio identificam o equipamento destinado à casa.
4. **Contrato** — o `.docx` só é liberado depois da aprovação e com a série preenchida.
5. **Instalação** — data e foto comprovam a entrega física.
6. **Ativação** — o processo só termina quando o BAM estiver atualizado.

Status disponíveis: `Rascunho`, `Solicitado`, `Em aprovação`, `Aprovado`, `Máquina reservada`, `Contrato enviado`, `Assinado`, `Instalação agendada`, `Instalado` e `Ativo`.

## O que a v3 acrescenta

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
