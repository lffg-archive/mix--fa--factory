# Especificações Técnicas

| Chave da configuração |    Tipo   |    Padrão   |                                                                                     Função                                                                                     |
|:---------------------:|:---------:|:-----------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
|        `label`        |  _string_ | `undefined` |                                                                           Controla o label do input.                                                                           |
|     `placeholder`     |  _string_ | `undefined` |                                                                        Controla o placeholder do input.                                                                        |
|        `insert`       |  _string_ | `undefined` | Insere um texto determinado. É uma configuração importante. Para configurá-la, temos que usar o `{{CONTENT}}`, que será substituído pelo valor colocado pelo usuário no input. |
|        `forums`       |  _array_  |   `['*']`   |                                                                Determina em quais subfóruns o script funcionará.                                                               |
|       `required`      | _boolean_ |   `false`   |                                                                     Define se o campo é obrigatório ou não.                                                                    |
