export function formatAnyNR(nr: string): string {
  return nr.replace('\n', '').trim()
}

export function getFirstNRs(): string[] {
  const nrPoints = `
  13.4.4.12 O relatório de inspeção de segurança, mencionado na alínea "e" do subitem 13.4.1.5, deve conter no mínimo:
  a) dados constantes na placa de identificação da caldeira;
  b) categoria da caldeira;
  c) tipo da caldeira;
  d) tipo de inspeção executada;
  e) data de início e término da inspeção;
  f) descrição das inspeções, exames e testes executados;
  g) registros fotográficos do exame interno da caldeira;
  h) resultado das inspeções e intervenções executadas;
  i) relação dos itens desta NR, relativos a caldeiras, que não estão sendo atendidos;
  j) recomendações e providências necessárias;
  k) parecer conclusivo quanto à integridade da caldeira até a próxima inspeção;
  l) data prevista para a próxima inspeção de segurança da caldeira;
  m) nome legível, assinatura e número do registro no conselho profissional do PLH e nome legível e assinatura de técnicos que participaram da inspeção; e
  n) número do certificado de inspeção e teste da válvula de segurança.
  `

  const singleNr = [
    '13.4.4.1 As caldeiras devem ser submetidas a inspeções de segurança inicial, periódica e extraordinária.',
    `
    13.4.4.2 A inspeção de segurança inicial deve ser feita em caldeiras novas, antes da entrada em funcionamento, no local definitivo de instalação, devendo compreender exame interno, externo e teste de pressão.
  `,
    `
    13.4.4.4 A inspeção de segurança periódica, constituída por exames interno e externo, deve ser executada nos seguintes prazos máximos:
    a) doze meses para caldeiras das categorias A e B;
    b) dezoito meses para caldeiras de recuperação de álcalis de qualquer categoria;
    c) vinte e quatro meses para caldeiras da categoria A, desde que aos doze meses sejam testadas as pressões de abertura das válvulas de segurança; ou
    d) trinta meses para caldeiras de categoria B com sistema de gerenciamento de combustão - SGC que atendam ao disposto no Anexo IV desta NR.
  `,
    `
    13.4.4.5 Estabelecimentos que possuam SPIE, conforme estabelecido no Anexo II, podem estender os períodos entre inspeções de segurança, respeitando os seguintes prazos máximos:
    a) vinte e quatro meses para as caldeiras de recuperação de álcalis;
    b) vinte e quatro meses para as caldeiras da categoria B;
    c) trinta meses para caldeiras da categoria A; ou
    d) quarenta e oito meses para caldeiras de categoria A com Sistema Instrumentado de Segurança - SIS, que atendam ao disposto no Anexo IV desta NR.
  `,
    `
  13.4.4.10 A inspeção de segurança extraordinária deve ser feita nas seguintes oportunidades:
  a) sempre que a caldeira for danificada por acidente ou outra ocorrência capaz de comprometer sua segurança;
  b) quando a caldeira for submetida a alteração ou reparo importante capaz de alterar suas condições de segurança;
  c) antes de a caldeira ser recolocada em funcionamento, quando permanecer inativa por mais de seis meses; ou
  d) quando houver mudança de local de instalação da caldeira.
  `,
  ]

  return [nrPoints, ...singleNr]
}

export function getSecondNRs(): string[] {
  const singleNrs = [
    `
      13.3.1 As seguintes situações constituem condição de grave e iminente risco:
      b) atraso na inspeção de segurança periódica de caldeiras;
      13.4.4.4 A inspeção de segurança periódica, constituída por exames interno e externo, deve ser executada nos seguintes prazos máximos:
      a) doze meses para caldeiras das categorias A e B;
      b) dezoito meses para caldeiras de recuperação de álcalis de qualquer categoria;
      c) vinte e quatro meses para caldeiras da categoria A, desde que aos doze meses sejam testadas as pressões de abertura das válvulas de segurança; ou
      d) trinta meses para caldeiras de categoria B com sistema de gerenciamento de combustão - SGC que
      atendam ao disposto no Anexo IV desta NR.
    `,
    `
      13.3.1.1 Por motivo de força maior e com justificativa formal do empregador, acompanhada por análise técnica e respectivas medidas de contingência para mitigação dos riscos, elaborada por Profissional Legalmente Habilitado - PLH ou por grupo multidisciplinar por ele coordenado, pode ocorrer postergação de até seis meses do prazo previsto para a inspeção de segurança periódica dos equipamentos abrangidos por esta NR.
    `,
    `
      13.3.1.1.1 O empregador deve comunicar ao sindicato dos trabalhadores da categoria predominante do estabelecimento a justificativa formal para postergação da inspeção de segurança periódica dos equipamentos abrangidos por esta NR.
    `,
    `
      13.4.4.6 No máximo, ao completar vinte e cinco anos de uso, na sua inspeção subsequente, as caldeiras devem ser submetidas a uma avaliação de integridade com maior abrangência, de acordo com códigos ou normas aplicáveis, para determinar a sua vida remanescente e novos prazos máximos para inspeção, caso ainda estejam em condições de uso.
    `,
    `
      13.4.4.11.2 A representação sindical da categoria profissional predominante do estabelecimento pode solicitar ao empregador que seja enviada, de maneira regular, cópia do relatório de inspeção de segurança da caldeira, no prazo de trinta dias após a sua elaboração, ficando o empregador desobrigado de atender ao contido nos subitens 13.4.4.11 e 13.4.4.11.1..
    `,
    `
      13.3.8 Os relatórios de inspeção de segurança dos equipamentos abrangidos por esta NR devem ser elaborados em até 60 (sessenta) dias ou, no caso de parada geral de manutenção, em até 90 (noventa) dias.
    `,
  ]

  return singleNrs
}

export function getNrsOfEngineer(): string[] {
  const nrs = [
    `
      13.3.2 Para efeito desta NR, considera-se PLH aquele que tem competência legal para o exercício da profissão de engenheiro nas atividades referentes a  projeto de construção, acompanhamento da operação e da manutenção, inspeção e supervisão de inspeção de caldeiras, vasos de pressão, tubulações e tanques metálicos de armazenamento, em conformidade com a regulamentação profissional vigente no País.
    `,
    `
      13.3.3 A inspeção de segurança dos equipamentos abrangidos por esta NR deve ser executada sob a responsabilidade técnica de PLH.
    `,
    `
      13.3.4 A inspeção de segurança dos equipamentos abrangidos por esta NR deve ser respaldada por exames e testes, a critério técnico do PLH, observado o disposto em códigos ou normas aplicáveis.
    `,
  ]

  return nrs
}

export function getOperatorNrs(): string[] {
  const nrs = [
    `
      13.3.1 As seguintes situações constituem condição de grave e iminente risco:
        1. f) operação de caldeira em desacordo com o disposto no item 13.4.3.3 desta NR.
    `,
    `
      13.4.3.3 Toda caldeira deve estar, obrigatoriamente, sob operação e controle de operador de caldeira.
      13.4.3.4 É considerado operador de caldeira aquele que cumprir o disposto no item 1.1 do Anexo I desta NR.
    `,
  ]

  return nrs
}

export function getFirstBoilerNrs(): string[] {
  const nr = `
    13.4.1.3 Toda caldeira deve ter afixada em seu corpo, em local de fácil acesso e visível, placa de identificação indelével com, no mínimo, as seguintes informações:
    a) nome do fabricante;
    b) número de ordem dado pelo fabricante da caldeira;
    c) ano de fabricação;
    d) pressão máxima de trabalho admissível;
    e) capacidade de produção de vapor;
    f) área de superfície de aquecimento; e
    g) código de construção e ano de edição. 
  `

  return [nr]
}

export function getFourthNrs(): string[] {
  const nr = `
    13.4.1.1 Para os propósitos desta NR, as caldeiras devem ser categorizadas da seguinte forma:
    a) caldeiras da categoria A são aquelas cuja pressão de operação é igual ou superior a 1.960 kPa (19,98 kgf/cm²); ou
    b) caldeiras da categoria B são aquelas cuja pressão de operação seja superior a 60 kPa (0,61 kgf/cm²) e inferior a 1 960 kPa (19,98 kgf/cm2). 
  `

  return [nr]
}

export function getNrsOfBoiler(): string[] {
  const nrs = [
    `
    13.3.1 As seguintes situações constituem condição de grave e iminente risco:
      1. b) atraso na inspeção de segurança periódica de caldeiras;
    `,
    `
    13.4.1.5 Toda caldeira deve possuir, no estabelecimento onde estiver 
    instalada, a seguinte documentação devidamente atualizada:
      1. a) prontuário da caldeira, fornecido por seu fabricante, contendo as seguintes informações:
        I - código de construção e ano de edição;
        II - especificação dos materiais;
        III - procedimentos utilizados na fabricação, montagem e 
        inspeção final;
        IV - metodologia para estabelecimento da PMTA;
        V - registros da execução do teste hidrostático de fabricação;
        VI - conjunto de desenhos e demais dados necessários ao 
        monitoramento da vida útil da caldeira;
        VII - características funcionais;
        VIII - dados dos dispositivos de segurança;
        IX - ano de fabricação; e
        X - categoria da caldeira;
        1. b) registro de segurança;
        2. c) projeto de instalação;
        3. d) projeto de alteração ou reparo;
        4. e) relatórios de inspeção de segurança; e
        5. f) certificados de inspeção e teste dos dispositivos de segurança.
    `,
    `  
    13.4.1.8 O registro de segurança deve ser constituído por livro de páginas numeradas, pastas ou sistema informatizado onde serão registradas:
      1. a) todas as ocorrências importantes capazes de influir nas condições de segurança da caldeira, inclusive alterações nos prazos de inspeção; e
      2. b) as ocorrências de inspeções de segurança inicial, periódica e extraordinária, devendo constar a condição operacional da caldeira, o nome legível e assinatura de PLH e do operador de caldeira presente na ocasião da inspeção.
    `,
    `
    13.4.1.6 Quando inexistente ou extraviado, o prontuário da caldeira deve ser reconstituído pelo empregador, com responsabilidade técnica do fabricante ou de PLH, sendo imprescindível a reconstituição das características funcionais, dos dados dos dispositivos de segurança e da memória de cálculo da PMTA.
    `,
    `
    13.4.1.7 Quando a caldeira for vendida ou transferida de estabelecimento, os documentos mencionados nas alíneas "a", "d", e "e" do subitem 13.4.1.5 devem acompanhá-la.
    `,
    `
    13.4.3.1 Toda caldeira deve possuir manual de operação atualizado, em língua portuguesa, em local de fácil acesso aos operadores, contendo no mínimo:
      1. a) procedimentos de partidas e paradas;
      2. b) procedimentos e parâmetros operacionais de rotina;
      3. c) procedimentos para situações de emergência; e
      4. d) procedimentos gerais de segurança, de saúde e de preservação do meio ambiente.
    `,
    `
    13.4.4.13 Sempre que os resultados da inspeção determinarem alterações dos dados de projeto, a placa de identificação e a documentação do prontuário devem ser atualizadas.
    `,
    `
    13.3.7.1 Quando não for conhecido o código de construção, deve ser respeitada a concepção original da caldeira, vaso de pressão, tubulação ou tanque metálico de armazenamento, empregando-se os procedimentos de controle prescritos pelos códigos aplicáveis a esses equipamentos.
    `,
    `
    13.3.7.2 A critério técnico do PLH, podem ser utilizadas tecnologias de cálculo ou procedimentos mais avançados, em substituição aos previstos pelos códigos de construção.
    `,
    `
    13.3.7.3 Projetos de alteração ou reparo devem ser concebidos previamente nas seguintes situações:
      1. a) sempre que as condições de projeto forem modificadas; ou
      2. b) sempre que forem realizados reparos que possam comprometer a segurança.
    `,
    `
    13.3.7.4 Os projetos de alteração e os projetos de reparo devem:
      1. a) ser concebidos ou aprovados por PLH;
      2. b) determinar materiais, procedimentos de execução, controle de qualidade e qualificação de pessoal; e
      3. c) ser divulgados para os empregados do estabelecimento que estão envolvidos com o equipamento.
    `,
  ]

  return nrs
}

export function getExternalExamsNrs(): string[] {
  const nr = [
    `
  13.4.1.3 Toda caldeira deve ter afixada em seu corpo, em local de fácil acesso e visível, placa de identificação indelével com, no mínimo, as seguintes informações:
    a) nome do fabricante;
    b) número de ordem dado pelo fabricante da caldeira;
    c) ano de fabricação;
    d) pressão máxima de trabalho admissível;
    e) capacidade de produção de vapor;
    f) área de superfície de aquecimento; e
    g) código de construção e ano de edição.`,
    `
  13.4.1.4 Além da placa de identificação, deve constar, em local visível, a categoria da caldeira e seu número ou código de identificação.
  13.3.6 Os instrumentos e sistemas de controle e segurança dos equipamentos abrangidos por esta NR devem ser mantidos em condições adequadas de uso e devidamente inspecionados e testados ou, quando aplicável, calibrados.
  13.4.4.13 Sempre que os resultados da inspeção determinarem alterações dos dados de projeto, a placa de identificação e a documentação do prontuário devem ser atualizadas.
  `,
  ]

  return nr
}

export function getInternalExamsNrs(): string[] {
  const nr = `
  13.3.7.5 Todas as intervenções que exijam mandrilamento ou soldagem em partes que operem sob pressão devem ser objeto de exames ou testes para controle da qualidade com parâmetros definidos por PLH, de acordo com códigos ou normas aplicáveis.
  `

  return [nr]
}

export function getLevelIndicatorNrs(): string[] {
  const nr = [
    `
  13.4.1.2 As caldeiras devem ser dotadas dos seguintes itens:
    e) sistema automático de controle do nível de água com intertravamento que evite o superaquecimento por alimentação deficiente.
    `,
    `
  13.3.1 As seguintes situações constituem condição de grave e iminente risco:
    c) ausência ou bloqueio de dispositivos de segurança, sem a devida justificativa técnica, baseada em códigos, normas ou procedimentos formais de operação do equipamento;
    `,
    `
  13.3.1 As seguintes situações constituem condição de grave e iminente risco:
    d) ausência ou indisponibilidade operacional de dispositivo de controle do nível de água na caldeira;
    `,
    `
  13.3.5 É proibida a inibição dos instrumentos, controles e sistemas de segurança, exceto quando prevista, de forma provisória, em procedimentos formais de operação e manutenção ou mediante justificativa formalmente documentada elaborada por responsável técnico, com prévia análise de risco e anuência do empregador ou de preposto por ele designado, desde que mantida a segurança operacional.
  `,
    `13.3.6 Os instrumentos e sistemas de controle e segurança dos equipamentos abrangidos por esta NR devem ser mantidos em condições adequadas de uso e devidamente inspecionados e testados ou, quando aplicável, calibrados.
  `,
    `13.3.7 Todos os reparos ou alterações em equipamentos abrangidos nesta NR devem respeitar os respectivos códigos de construção e as prescrições do fabricante no que se refere a:
    a) materiais;   
    b) procedimentos de execução;   
    c) procedimentos de controle de qualidade; e   
    d) qualificação e certificação de pessoal.
  `,
  ]

  return nr
}

export function getValveNrs(): string[] {
  const nr = [
    `
  13.4.1.2 As caldeiras devem ser dotadas dos seguintes itens:
    a) válvula de segurança com pressão de abertura ajustada em valor igual ou inferior à Pressão Máxima de Trabalho Admissível - PMTA, respeitados os requisitos do código de construção relativos a aberturas escalonadas e tolerâncias de pressão de ajuste;
    `,
    `
  13.4.4.7 As válvulas de segurança de caldeiras devem ser desmontadas, inspecionadas e testadas com prazo adequado à sua manutenção, porém, não superior ao previsto para a inspeção de segurança periódica das caldeiras por elas protegidas, de acordo com os subitens 13.4.4.4 e 13.4.4.5.
  `,
    `
  13.4.4.7.1 Em situações excepcionais, devidamente justificadas por PLH, as válvulas de segurança que não atendam ao disposto no subitem 13.4.4.7 podem ser testadas no campo, com uma frequência compatível com o histórico operacional destes dispositivos.
  `,
    `
  13.4.4.8 Além do disposto no subitem 13.4.4.7, as válvulas de segurança instaladas em caldeiras de categoria B devem ser testadas periodicamente conforme segue:
    a) pelo menos uma vez por mês, mediante acionamento manual da alavanca durante a operação de caldeiras sem tratamento de água, exceto para aquelas que vaporizem fluido térmico; ou
    b) as caldeiras que operem com água tratada devem ter a alavanca acionada manualmente, de acordo com as prescrições do fabricante.
    `,
    `
  13.3.1 As seguintes situações constituem condição de grave e iminente risco:
    c) ausência ou bloqueio de dispositivos de segurança, sem a devida justificativa técnica, baseada em códigos, normas ou procedimentos formais de operação do equipamento;
    `,
    `
  13.3.5 É proibida a inibição dos instrumentos, controles e sistemas de segurança, exceto quando prevista, de forma provisória, em procedimentos formais de operação e manutenção ou mediante justificativa formalmente documentada elaborada por responsável técnico, com prévia análise de risco e anuência do empregador ou de preposto por ele designado, desde que mantida a segurança operacional.
  `,
    `
  13.3.6 Os instrumentos e sistemas de controle e segurança dos equipamentos abrangidos por esta NR devem ser mantidos em condições adequadas de uso e devidamente inspecionados e testados ou, quando aplicável, calibrados.
  `,
    `
  13.3.7 Todos os reparos ou alterações em equipamentos abrangidos nesta NR devem respeitar os respectivos códigos de construção e as prescrições do fabricante no que se refere a:
    a) materiais;
    b) procedimentos de execução;
    c) procedimentos de controle de qualidade; e
    d) qualificação e certificação de pessoal.
  `,
  ]

  return nr
}

export function getCommandsAndDevicesNrs(): string[] {
  const nr = [
    `
  13.4.1.2 As caldeiras devem ser dotadas dos seguintes itens:
    e) sistema automático de controle do nível de água com intertravamento que evite o superaquecimento por alimentação deficiente.
`,
    `
  13.3.1 As seguintes situações constituem condição de grave e iminente risco:
    c) ausência ou bloqueio de dispositivos de segurança, sem a devida justificativa técnica, baseada em códigos, normas ou procedimentos formais de operação do equipamento;
`,
    `
  13.3.1 As seguintes situações constituem condição de grave e iminente risco:
    d) ausência ou indisponibilidade operacional de dispositivo de controle do nível de água na caldeira;
`,
    `
  13.3.5 É proibida a inibição dos instrumentos, controles e sistemas de segurança, exceto quando prevista, de forma provisória, em procedimentos formais de operação e manutenção ou mediante justificativa formalmente documentada elaborada por responsável técnico, com prévia análise de risco e anuência do empregador ou de preposto por ele designado, desde que mantida a segurança operacional.
  `,
    `
  13.3.6 Os instrumentos e sistemas de controle e segurança dos equipamentos abrangidos por esta NR devem ser mantidos em condições adequadas de uso e devidamente inspecionados e testados ou, quando aplicável, calibrados.
  `,
    `
  13.3.7 Todos os reparos ou alterações em equipamentos abrangidos nesta NR devem respeitar os respectivos códigos de construção e as prescrições do fabricante no que se refere a:
    a) materiais;
    b) procedimentos de execução;
    c) procedimentos de controle de qualidade; e
    d) qualificação e certificação de pessoal.
  `,
  ]

  return nr
}

export function getBottomDischargeSystem(): string[] {
  const nr = [
    `
  13.3.1 As seguintes situações constituem condição de grave e iminente risco:
    c) ausência ou bloqueio de dispositivos de segurança, sem a devida justificativa técnica, baseada em códigos, normas ou procedimentos formais de operação do equipamento;
    `,
    `
  13.3.4.3 A execução de testes pneumáticos ou hidropneumáticos, quando indispensável, deve ser realizada sob responsabilidade técnica de PLH, com aprovação prévia dos procedimentos a serem aplicados.
  `,
    `
  13.3.5 É proibida a inibição dos instrumentos, controles e sistemas de segurança, exceto quando prevista, de forma provisória, em procedimentos formais de operação e manutenção ou mediante justificativa formalmente documentada elaborada por responsável técnico, com prévia análise de risco e anuência do empregador ou de preposto por ele designado, desde que mantida a segurança operacional.
  `,
    `13.3.6 Os instrumentos e sistemas de controle e segurança dos equipamentos abrangidos por esta NR devem ser mantidos em condições adequadas de uso e devidamente inspecionados e testados ou, quando aplicável, calibrados.
  `,
    `13.3.7 Todos os reparos ou alterações em equipamentos abrangidos nesta NR devem respeitar os respectivos códigos de construção e as prescrições do fabricante no que se refere a:
    a) materiais;
    b) procedimentos de execução;
    c) procedimentos de controle de qualidade; e
    d) qualificação e certificação de pessoal.
  `,
  ]

  return nr
}

export function getWaterQualityNrs(): string[] {
  const nr = `
  13.4.3.2 A qualidade da água deve ser controlada e tratamentos devem ser implementados, quando necessários, para compatibilizar suas propriedades físico-químicas com os parâmetros de operação da caldeira definidos pelo fabricante.
  `.trim()

  return [nr]
}

export function getBoilerHome(): string[] {
  const nr = [
    `
  13.4.2.1 A autoria do projeto de instalação de caldeiras é de responsabilidade de PLH, e deve obedecer aos aspectos de segurança, saúde e meio ambiente previstos nas normas regulamentadoras, convenções e disposições legais aplicáveis.
  `,
    `
  13.4.2.2 As caldeiras de qualquer estabelecimento devem ser instaladas em local específico para tal fim, denominado casa de caldeiras ou área de caldeiras.
  `,
    `
  13.4.2.3 Quando a caldeira for instalada em ambiente aberto, a área de caldeiras deve satisfazer os seguintes requisitos:
    a) estar afastada, no mínimo, três metros de outras instalações do estabelecimento, dos depósitos de combustíveis, excetuando-se reservatórios para partida com até dois mil litros de capacidade, do limite de propriedade de terceiros e do limite com as vias públicas;
    b) dispor de pelo menos duas saídas amplas, permanentemente desobstruídas, sinalizadas e dispostas em direções distintas;
    c) dispor de acesso fácil e seguro, necessário à operação e à manutenção da caldeira, sendo que, para guarda-corpos vazados, os vãos devem ter dimensões que impeçam a queda de pessoas;
    d) ter sistema de captação e lançamento dos gases e material particulado, provenientes da combustão, para fora da área de operação, atendendo às normas ambientais vigentes;
    e) dispor de iluminação conforme normas oficiais vigentes; e
    f) ter sistema de iluminação de emergência caso opere à noite.
    `,
    `
  13.4.2.4 Quando a caldeira estiver instalada em ambiente fechado, a casa de caldeiras deve satisfazer os seguintes requisitos:
    a) constituir prédio separado, construído de material resistente ao fogo, podendo ter apenas uma parede adjacente a outras instalações do estabelecimento, porém com as outras paredes afastadas de, no mínimo, três metros de outras instalações, do limite de propriedade de terceiros, do limite com as vias públicas e de depósitos de combustíveis, excetuando-se reservatórios para partida com até dois mil litros de capacidade;
    b) dispor de pelo menos duas saídas amplas, permanentemente desobstruídas, sinalizadas e dispostas em direções distintas;
    c) dispor de ventilação permanente com entradas de ar que não possam ser bloqueadas;
    d) dispor de sensor para detecção de vazamento de gás, quando se tratar de caldeira a combustível gasoso;
    e) não ser utilizada para qualquer outra finalidade;
    f) dispor de acesso fácil e seguro, necessário à operação e à manutenção da caldeira, sendo que, para guarda-corpos vazados, os vãos devem ter dimensões que impeçam a queda de pessoas;
    g) ter sistema de captação e lançamento dos gases e material particulado, provenientes da combustão, para fora da área de operação, atendendo às normas ambientais vigentes;
    h) dispor de iluminação conforme normas oficiais vigentes e ter sistema de iluminação de emergência.
    `,
    `
  13.4.2.5 Quando o estabelecimento não puder atender ao disposto nos subitens 13.4.2.3 e 13.4.2.4, deve ser elaborado projeto alternativo de instalação, com medidas complementares de segurança que permitam a atenuação dos riscos, comunicando previamente à representação sindical da categoria profissional predominante do estabelecimento.
`,
    `
  13.4.2.6 As caldeiras classificadas na categoria A devem possuir painel de instrumentos instalados em sala de controle, construída segundo o que estabelecem as normas regulamentadoras aplicáveis.
  `,
  ]

  return nr
}

export function getManometerNr(): string[] {
  const nr = [
    `
  13.4.1.2 As caldeiras devem ser dotadas dos seguintes itens:
    b) instrumento que indique a pressão do vapor acumulado;
    `,
    `
  13.3.1 As seguintes situações constituem condição de grave e iminente risco:
    c) ausência ou bloqueio de dispositivos de segurança, sem a devida justificativa técnica, baseada em códigos, normas ou procedimentos formais de operação do equipamento;
    `,
    `
  13.3.5 É proibida a inibição dos instrumentos, controles e sistemas de segurança, exceto quando prevista, de forma provisória, em procedimentos formais de operação e manutenção ou mediante justificativa formalmente documentada elaborada por responsável técnico, com prévia análise de risco e anuência do empregador ou de preposto por ele designado, desde que mantida a segurança operacional.
  `,
    `
  13.3.6 Os instrumentos e sistemas de controle e segurança dos equipamentos abrangidos por esta NR devem ser mantidos em condições adequadas de uso e devidamente inspecionados e testados ou, quando aplicável, calibrados.
  `,
    `
  13.3.7 Todos os reparos ou alterações em equipamentos abrangidos nesta NR devem respeitar os respectivos códigos de construção e as prescrições do fabricante no que se refere a:
    a) materiais;
    b) procedimentos de execução;
    c) procedimentos de controle de qualidade; e
    d) qualificação e certificação de pessoal.
  `,
  ]

  return nr
}

export function getInjectorNr(): string[] {
  const nr = [
    `
  13.4.1.2 As caldeiras devem ser dotadas dos seguintes itens:
    c) injetor ou sistema de alimentação de água independente do principal, nas caldeiras de combustível sólido não atomizado ou com queima em suspensão;
    `,
    `
  13.3.1 As seguintes situações constituem condição de grave e iminente risco:
    c) ausência ou bloqueio de dispositivos de segurança, sem a devida justificativa técnica, baseada em códigos, normas ou procedimentos formais de operação do equipamento;
    `,
    `
  13.3.5 É proibida a inibição dos instrumentos, controles e sistemas de segurança, exceto quando prevista, de forma provisória, em procedimentos formais de operação e manutenção ou mediante justificativa formalmente documentada elaborada por responsável técnico, com prévia análise de risco e anuência do empregador ou de preposto por ele designado, desde que mantida a segurança operacional.
  `,
    `
  13.3.6 Os instrumentos e sistemas de controle e segurança dos equipamentos abrangidos por esta NR devem ser mantidos em condições adequadas de uso e devidamente inspecionados e testados ou, quando aplicável, calibrados.
  `,
    `
  13.3.7 Todos os reparos ou alterações em equipamentos abrangidos nesta NR devem respeitar os respectivos códigos de construção e as prescrições do fabricante no que se refere a:
    a) materiais;
    b) procedimentos de execução;
    c) procedimentos de controle de qualidade; e
    d) qualificação e certificação de pessoal.
  `,
  ]
  return nr
}

export function getEletricalNrs(): string[] {
  const nr = [
    `
  13.4.1.2 As caldeiras devem ser dotadas dos seguintes itens:
    e) sistema automático de controle do nível de água com intertravamento que evite o superaquecimento por alimentação deficiente.
    `,
    `
  13.3.1 As seguintes situações constituem condição de grave e iminente risco:
    c) ausência ou bloqueio de dispositivos de segurança, sem a devida justificativa técnica, baseada em códigos, normas ou procedimentos formais de operação do equipamento;
    `,
    `
    `,
    `13.3.5 É proibida a inibição dos instrumentos, controles e sistemas de segurança, exceto quando prevista, de forma provisória, em procedimentos formais de operação e manutenção ou mediante justificativa formalmente documentada elaborada por responsável técnico, com prévia análise de risco e anuência do empregador ou de preposto por ele designado, desde que mantida a segurança operacional.
    `,
    ` 13.3.6 Os instrumentos e sistemas de controle e segurança dos equipamentos abrangidos por esta NR devem ser mantidos em condições adequadas de uso e devidamente inspecionados e testados ou, quando aplicável, calibrados.
    `,
    `13.3.7 Todos os reparos ou alterações em equipamentos abrangidos nesta NR devem respeitar os respectivos códigos de construção e as prescrições do fabricante no que se refere a:
    a) materiais;
    b) procedimentos de execução;
    c) procedimentos de controle de qualidade; e
    d) qualificação e certificação de pessoal.
  `,
  ]

  return nr
}

export function getTestsHydrostatics(): string[] {
  const nr = [
    `
  13.4.4.3 As caldeiras devem, obrigatoriamente, ser submetidas a Teste Hidrostático - TH em sua fase de fabricação, com comprovação por meio de laudo assinado por PLH.
  `,
    `
  13.4.4.3.1 Na falta de comprovação documental de que o TH tenha sido realizado na fase de fabricação, se aplicará o disposto a seguir:
    a) para as caldeiras fabricadas ou importadas a partir de 2 de maio de 2014, o TH correspondente ao da fase de fabricação deve ser feito durante a inspeção de segurança inicial; ou
    b) para as caldeiras em operação antes de 2 de maio de 2014, a execução do TH correspondente ao da fase de fabricação fica a critério técnico do PLH e, caso este julgue necessário, deve ser executado até a próxima inspeção de segurança periódica interna.
  `,
  ]

  return nr
}

export function getTestsAccumulation(): string[] {
  const nr = `
  13.4.4.9 Adicionalmente aos testes prescritos nos subitens 13.4.4.7 e 13.4.4.8, as válvulas de segurança instaladas em caldeiras podem ser submetidas a testes de acumulação, a critério técnico do PLH.
  `.trim()

  return [nr]
}

export function getPMTANr(): string[] {
  const nr = [
    `
  13.4.1.9 Caso a caldeira venha a ser considerada inadequada para uso, o registro de segurança deve conter tal informação e receber encerramento formal.
  `,
    `
  13.1.2 O empregador é o responsável pela adoção das medidas determinadas nesta NR. 13.1.3 O disposto no item anterior aplica-se também aos equipamentos pertencentes a terceiros, circunscritos ao estabelecimento do empregador. 
	`,
    `13.1.3.1 A responsabilidade do empregador não elide o dever do proprietário dos equipamentos de cumprir as disposições legais e regulamentares acerca do tema. 
	`,
    `13.4.4.11.1 Mediante o recebimento de requisição formal, o empregador deve encaminhar à representação sindical da categoria profissional predominante do estabelecimento, no prazo máximo de 10 (dez) dias após a sua elaboração, a cópia do relatório de inspeção. 
	`,
    `13.4.4.11.2 A representação sindical da categoria profissional predominante do estabelecimento pode solicitar ao empregador que seja enviada, de maneira regular, cópia do relatório de inspeção de segurança da caldeira, no prazo de trinta dias após a sua elaboração, ficando o empregador desobrigado de atender ao contido nos subitens 
	`,
    `13.4.4.11 e 13.4.4.11.1. 
	`,
    `13.3.11 O empregador deve comunicar à autoridade regional competente em matéria de trabalho e ao sindicato da categoria profissional predominante do estabelecimento a ocorrência de vazamento, incêndio ou explosão envolvendo equipamentos abrangidos por esta NR que tenha como consequência uma das situações a seguir: a) morte de trabalhador(es); b) internação hospitalar de trabalhador(es); ou c) eventos de grande proporção. 
	`,
    `13.3.11.1 A comunicação deve ser encaminhada até o segundo dia útil após a ocorrência e deve conter: a) razão social do empregador, endereço, local, data e hora da ocorrência; b) descrição da ocorrência; c) nome e função da(s) vítima(s); d) procedimentos de investigação adotados; e) cópia do último relatório de inspeção de segurança do equipamento envolvido; e f) cópia da Comunicação de Acidente de Trabalho - CAT. 
	`,
    `13.3.11.2 Na ocorrência de acidentes previstos no subitem 
	`,
    `13.3.11, o empregador deve comunicar formalmente a representação sindical dos trabalhadores predominante do estabelecimento para participar da respectiva investigação.
  `,
  ]

  return nr.map((n) => n.trim())
}

export function getPMTAPageNr(): string[] {
  const nr = [
    `
  13.1.2 O empregador é o responsável pela adoção das medidas determinadas nesta NR.
  `,
    `
  13.1.3 O disposto no item anterior aplica-se também aos equipamentos pertencentes a terceiros, circunscritos ao estabelecimento do empregador.
  
  `,
    `13.1.3.1 A responsabilidade do empregador não elide o dever do proprietário dos equipamentos de cumprir as disposições legais e regulamentares acerca do tema.
  
  `,
    `13.4.4.11.1 Mediante o recebimento de requisição formal, o empregador deve encaminhar à representação sindical da categoria profissional predominante do estabelecimento, no prazo máximo de 10 (dez) dias após a sua elaboração, a cópia do relatório de inspeção.
  
  `,
    `13.4.4.11.2 A representação sindical da categoria profissional predominante do estabelecimento pode solicitar ao empregador que seja enviada, de maneira regular, cópia do relatório de inspeção de segurança da caldeira, no prazo de trinta dias após a sua elaboração, ficando o empregador desobrigado de atender ao contido nos subitens 13.4.4.11 e 13.4.4.11.1.
  
  `,
    `13.3.11 O empregador deve comunicar à autoridade regional competente em matéria de trabalho e ao sindicato da categoria profissional predominante do estabelecimento a ocorrência de vazamento, incêndio ou explosão envolvendo equipamentos abrangidos por esta NR que tenha como consequência uma das situações a seguir:
    a) morte de trabalhador(es);
    b) internação hospitalar de trabalhador(es); ou
    c) eventos de grande proporção.

    `,
    `
  13.3.11.1 A comunicação deve ser encaminhada até o segundo dia útil após a ocorrência e deve conter:
    a) razão social do empregador, endereço, local, data e hora da ocorrência;
    b) descrição da ocorrência;
    c) nome e função da(s) vítima(s);
    d) procedimentos de investigação adotados;
    e) cópia do último relatório de inspeção de segurança do equipamento envolvido; e
    f) cópia da Comunicação de Acidente de Trabalho - CAT.

  `,
    `
  13.3.11.2 Na ocorrência de acidentes previstos no subitem 13.3.11, o empregador deve comunicar formalmente a representação sindical dos trabalhadores predominante do estabelecimento para participar da respectiva investigação.
  `.trim(),
    `
  13.3.4.2 Os exames e testes devem ser realizados em condições de segurança para os executantes e demais trabalhadores envolvidos.
  
  `,
    `13.3.8.1 Imediatamente após a inspeção de segurança de caldeira, vaso de pressão ou tanque metálico de armazenamento, deve ser anotada, no respectivo registro de segurança, previsto nos subitens 13.4.1.8, 13.5.1.7 e 13.7.1.3 desta NR, a condição operacional e de segurança.
  
  `,
    `13.3.8.2 As recomendações decorrentes das inspeções de segurança devem ser registradas e implementadas pelo empregador, com a determinação de prazos e responsáveis pela execução.
  
  `,
    `13.3.9 Os relatórios, projetos, certificados e demais documentos previstos nesta NR podem ser elaborados e armazenados em sistemas informatizados, com segurança da informação, ou mantidos em mídia eletrônica com assinatura validada por uma Autoridade Certificadora - AC, assegurados os requisitos de autenticidade, integridade, disponibilidade, rastreabilidade e irretratabilidade das informações.
  
  `,
    `13.3.9.1 No caso de versão impressa de relatórios de inspeção de segurança, as páginas devem ser numeradas.
  
  `,
    `13.3.10 A documentação dos equipamentos abrangidos por esta NR deve permanecer à disposição para consulta dos operadores, do pessoal de manutenção, de inspeção e das representações dos trabalhadores e do empregador na Comissão Interna de Prevenção de Acidentes - CIPA, devendo o empregador assegurar pleno acesso a essa documentação, inclusive à representação sindical da categoria profissional predominante do estabelecimento, quando formalmente solicitado.
  
  `,
    `13.3.12 As caldeiras e vasos de pressão comprovadamente de produção seriada devem ser certificados no âmbito do Sistema Brasileiro de Avaliação de Conformidade, quando aplicável.
  
  `,
    `13.3.13 É proibida a construção, importação, comercialização, leilão, locação, cessão a qualquer título, exposição e utilização de caldeiras e vasos de pressão sem a indicação do respectivo código de construção no prontuário e na placa de identificação.
  `.trim(),
  ]

  return nr.map((n) => n.trim())
}

export function getConclusionNrs(): string[] {
  const nr = [
    `
  13.4.1.9 Caso a caldeira venha a ser considerada inadequada para uso, o registro de segurança deve conter tal informação e receber encerramento formal.
  `,
    `13.3.1 As seguintes situações constituem condição de grave e iminente risco:
    e) operação de equipamento enquadrado nesta NR, cujo relatório de inspeção ateste a sua inaptidão operacional
    `,
    `
  13.4.4.11 O empregador deve informar à representação sindical da categoria profissional predominante do estabelecimento, quando demandado formalmente, num prazo máximo de 30 (trinta) dias após o término da inspeção de segurança periódica, a condição operacional da caldeira.
  `,
  ]

  return nr.map((n) => n.trim())
}
