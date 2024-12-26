type TextInfo = {
  title: string
  text: string
}

export type Services = {
  'boiler-inspection': TextInfo
  'integrity-inspection': TextInfo
  'pipe-inspection': TextInfo
  'pressure-vessel-inspection': TextInfo
  'automotive-elevator-inspection': TextInfo
  'fuel-tanks-inspection': TextInfo
  'safety-valve-calibration': TextInfo
  'manometer-calibration': TextInfo
}

export const TEXT_INFOS: Services = {
  'boiler-inspection': {
    title: 'Inspeção de Caldeiras',
    text: `
      As inspeções de caldeiras são realizadas para garantir a segurança.
      Essas inspeções envolvem uma análise detalhada das condições físicas
      da caldeira, funcionamento dos sistemas de segurança e desempenho
      geral do equipamento. O objetivo final dessas inspeções é garantir que
      as caldeiras estejam funcionando de maneira segura e eficiente,
      minimizando o risco de acidentes e falhas operacionais.
      <br></br>
      <br></br>
      <i>
        INSPEÇÃO DE ACORDO COM A NOVA NR-13, COM ANOTAÇÃO DE
        RESPONSABILIDADE TÉCNICA E RELATÓRIO DE INSPEÇÃO.
      </i>
      <ul>
        <li>Lançamento no Livro Registro de Segurança;</li>
        <li>Exame Interno;</li>
        <li>Exame Externo;</li>
        <li>Mapeamento Ultrassônico;</li>
        <li>Ensaio Hidrostático;</li>
        <li>Verificação dos Dispositivos de Segurança;</li>
        <li>Ensaio de Acumulação;</li>
        <li>Ensaio dos Dispositivos de Controle e Segurança;</li>
        <li>Verificação da Documentação Técnica e Prontuário;</li>
        <li>Avaliação e Atualização do PMTA;</li>
        <li>Calibração de Manômetro;</li>
        <li>Calibração de Válvulas de Segurança;</li>
        <li>Emissão de Relatório e da ART de reparo do CREA;</li>
      </ul>
      `.trim(),
  },
  'integrity-inspection': {
    title: 'Análise de Integridade Estrutural em Caldeira',
    text: `
      A vida útil da caldeira depende de vários fatores, como a qualidade do
      tratamento de água, o regime de utilização, os cuidados com as
      manutenções de rotina, entre outros. Após completar 25 anos, a
      caldeira deve ser submetida à inspeção de integridade,pois esta
      rigorosa inspeção visa detectar, através de análises e ensaios, se o
      equipamento pode ou não operar e sua vida remanescente.
      <br />
      <br />
      <ul>
        <li>Lançamento no Livro Registro de Segurança;</li>
        <li>Exame Interno e Externo;</li>
        <li>Mapeamento Ultrassônico;</li>
        <li>Verificação e Recomendação dos Dispositivos de Segurança;</li>
        <li>
          Ensaio Hidrostático, de Acumulação e dos Dispositivos de Controle
          Controle e Segurança;
        </li>
        <li>Verificação da Documentação Técnica e Prontuário;</li>
        <li>Avaliação e Atualização do PMTA;</li>
        <li>Limpeza das Soldas;</li>
        <li>Teste por Líquido Penerante em todas as Soldas e Junções;</li>
        <li>
          Ensaio de Réplica Metalográfica para Análise de Tensões e
          Estabilidade Micro Estrutural das Chapas;
        </li>
        <li>
          Ensaio de Estrutura Química das Chapas para Verificação de sua
          Compatibilidade com ASME II;
        </li>
        <li>Cálculo de Espessura Mínima e Vida Remanescente;</li>
        <li>Calibração de Manômetro e Válvulas de Segurança;</li>
        <li>Emissão de Relatório e da ART de reparo do CREA;</li>
      </ul>
      `.trim(),
  },
  'pipe-inspection': {
    title: 'Inspeção de Tubulações',
    text: `
      A inspeção de tubulações é um processo de avaliação da condição de
      tubos industriais, que transportam líquidos, gases ou vapores em
      sistemas de processo ou equipamentos, como caldeiras, trocadores de
      calor, entre outros. Essa inspeção tem como objetivo detectar falhas
      ou danos, como corrosão, trincas, furos, entre outros, que possam
      possam comprometer a segurança e a eficiência do sistema. As técnicas
      de inspeção utilizadas incluem testes não destrutivos, como ultrassom,
      inspeção visual, entre outros, que permitem identificar possíveis
      problemas internos sem interromper o funcionamento do sistema. Com
      base nas informações obtidas na inspeção, são tomadas decisões sobre a
      manutenção, reparo, visando garantir a integridade e a confiabilidade
      dos tubos.
      <ul>
        <li>Plano de Manutenção de Tubulação;</li>
        <li>Fluxograma das Linhas;</li>
        <li>Análise de Tubulações;</li>
        <li>Verificação de Vazamento;</li>
        <li>Análise da Temperatura com Câmera Termográfica;</li>
        <li>Ultrassom em pontos Específicos;</li>
        <li>Emissão de Relatório e da ART do CREA;</li>
      </ul>
      `.trim(),
  },
  'pressure-vessel-inspection': {
    title: 'Inspeção em Vasos de Pressão',
    text: `
      A inspeção de vasos de pressão é um processo de avaliação sistemática
      da condição física e funcional de equipamentos industriais que operam
      sob pressão, como vasos de armazenamento, tanques, compressores, entre
      outros. Esses equipamentos são projetados para suportar altas
      pressões, e por isso, a inspeção é fundamental para garantir a
      segurança e a confiabilidade do equipamento e do processo. Durante a
      inspeção, são realizadas análises de falhas e desgastes, verificação
      da integridade estrutural, avaliação de corrosão, entre outros testes.
      As técnicas de inspeção utilizadas incluem testes não destrutivos,
      como ultrassom, inspeção visual, entre outros, que permitem
      identificar possíveis problemas internos sem interromper o
      funcionamento do equipamento. Com base nas informações obtidas na
      obtidas na inspeção, são tomadas decisões sobre a manutenção, reparo
      ou substituição do equipamento, visando garantir a sua integridade e
      prolongar a sua vida útil. A inspeção de vasos de pressão é importante
      em diversos setores, como petróleo e gás, química, farmacêutica,
      alimentícia, entre outros, onde a segurança e a qualidade do produto
      são essenciais.
      `.trim(),
  },
  'automotive-elevator-inspection': {
    title: 'Inspeção de Elevador Automotivo',
    text: `
      A inspeção de elevador automotivo é um processo de avaliação da
      condição física e operacional de um equipamento utilizado para
      levantar veículos, permitindo acesso à parte inferior do veículo para
      manutenção e reparos. Esses equipamentos são utilizados em oficinas
      mecânicas, concessionárias, postos de serviços, entre outros. A
      inspeção é fundamental para garantir a segurança e a confiabilidade do
      elevador, evitando acidentes e garantindo o funcionamento adequado do
      equipamento. Durante a inspeção, são verificadas as condições da
      estrutura, das sapatas, do sistema hidráulico e elétrico, dos
      dispositivos de segurança, entre outros componentes. Com base nas
      informações obtidas na inspeção, são tomadas decisões sobre a
      manutenção, reparo ou substituição do elevador, visando garantir a sua
      integridade e prolongar a sua vida útil.
      <br />
      <br />
      ARRANJO FÍSICO E INSTALAÇÕES (Instalações e Dispositivos Elétricos;
      Dispositivos de Partida, Acionamento e Parada.)
      <br />
      SISTEMAS DE SEGURANÇA (Efetivo humano e suas limitações.)
      <br />
      PERIGOS DECORRENTES DA EXPOSIÇÃO (Sistemas de Segurança do
      Equipamento; Dispositivos de parada de Emergência; Aptdão dos
      Profissionais Operadores.)
      <br />
      ANÁLISE DE RISCOS DO EQUIPAMENTO (Análise de Probabilidades Reais de
      Acidentes; Identificação dos Métodos de Prevenção; Avaliação de Risco;
      Sistemas de Segurança; Verificação de EPIs; RETROFIT.)
      <br />
      DOCUMENTAÇÕES PERTINENTES (Manual de Instrução de Operação da Máquina
      ou Equipamento; Plano de Inspeção e Manutenção conforme NR12;
      Relatório Técnico conforme NR12.)
      <br />
      DISPOSIÇÕES FINAIS (Registro Fotográfico; Registro de Evidências;
      Conclusão do PLH; Proposta de Melhorias Corretivas; Emissão da ART.)
      `.trim(),
  },
  'fuel-tanks-inspection': {
    title: 'Inspeção em Tanques de Combustível',
    text: `
      A inspeção em tanques de combustível é um processo de avaliação da condição
      física e operacional de tanques que armazenam combustíveis, como gasolina, diesel,
      querosene, entre outros. Esses tanques são utilizados em diversos setores, como postos
      de gasolina, indústrias, transportadoras, entre outros. A inspeção é fundamental
      para garantir a segurança e a confiabilidade do tanque, evitando vazamentos e contaminações
      do meio ambiente e garantindo a qualidade do produto. Durante a inspeção, são realizadas análises 
      de falhas e desgastes, verificação da integridade estrutural, avaliação de corrosão e erosão, entre 
      outros testes. As técnicas de inspeção utilizadas incluem testes não destrutivos, como 
      ultrassom, radiografia, inspeção visual, entre outros, que permitem identificar possíveis 
      problemas internos sem esvaziar ou danificar o tanque. Com base nas informações obtidas 
      na inspeção, são tomadas decisões sobre a manutenção, reparo ou substituição do tanque, 
      visando garantir a sua integridade e prolongar a sua vida útil. A inspeção em tanques de 
      combustível é importante em diversos setores, onde o armazenamento seguro e confiável de 
      combustíveis é essencial para o funcionamento de equipamentos e veículos.
      `.trim(),
  },
  'safety-valve-calibration': {
    title: 'Calibração de Válvula de Segurança',
    text: `
      A calibração de válvula de segurança é um processo de verificação e
      ajuste da pressão de abertura e fechamento, que é um componente
      crítico em sistemas que operam sob pressão, como em equipamentos e
      processos industriais. A válvula de segurança tem a função de
      liberar o excesso de pressão que possa se acumular no sistema,
      evitando falhas e explosões que possam causar danos às pessoas e ao
      meio ambiente. Durante a calibração, é verificado se a pressão de
      abertura e fechamento da válvula está dentro dos padrões de
      segurança e se a válvula está funcionando corretamente. Caso haja
      algum desvio, são realizados ajustes ou reparos necessários. A
      calibração é realizada por profissionais especializados e utiliza
      equipamentos específicos e certificados, visando garantir a precisão
      e confiabilidade do processo. A calibração de válvula de segurança é
      essencial para manter a segurança dos sistemas que operam sob
      pressão e para garantir a conformidade com as normas e
      regulamentações técnicas aplicáveis.
      `.trim(),
  },
  'manometer-calibration': {
    title: 'Calibração de Manômetro',
    text: `
      A calibração de manômetro é um processo de ajuste e verificação da
      precisão de um instrumento de medição de pressão, para garantir que
      ele esteja operando de forma correta e precisa. A calibração é
      importante porque os manômetros podem sofrer desvios na sua precisão
      ao longo do tempo, devido ao uso, condições de armazenamento e outros
      fatores, o que pode levar a leituras incorretas e consequentemente a
      decisões erradas. Durante a calibração, um manômetro de referência é
      utilizado para comparar as leituras do manômetro a ser calibrado, e
      ajustes são feitos, se necessário, para corrigir quaisquer desvios. A
      calibração pode ser feita em laboratórios de calibração ou no local,
      dependendo das necessidades e da aplicação do manômetro. A calibração
      de manômetro é importante em diversos setores, como indústrias
      química, petroquímica, de alimentos e bebidas, farmacêutica, entre
      outras, onde a precisão da medição de pressão é essencial para
      garantir a qualidade do produto e a segurança do processo.
      `.trim(),
  },
}
