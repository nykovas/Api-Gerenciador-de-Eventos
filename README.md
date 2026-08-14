API Gerenciador de Eventos

API REST desenvolvida com Java e Spring Boot para gerenciamento de eventos. O projeto foi criado com o objetivo de aplicar conceitos de arquitetura em camadas, persistência de dados, validações e boas práticas de desenvolvimento backend.

Observação: Todo o desenvolvimento do backend, incluindo arquitetura, modelagem, regras de negócio, endpoints e persistência de dados, foi implementado integralmente por mim. O frontend presente no projeto foi gerado com o auxílio de ferramentas de IA e utilizado apenas para fornecer uma interface visual para consumo da API.

Tecnologias

Backend

* Java
* Spring Boot
* Spring Data JPA
* Hibernate
* Bean Validation
* PostgreSQL
* Maven

Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

Funcionalidades

* Cadastro, edição e exclusão de eventos
* Consulta de eventos por ID e listagem completa
* Ordenação de eventos por data
* Contagem de eventos cadastrados
* Listagem de eventos do dia
* Estatísticas gerais dos eventos
* Listagem de eventos lotados e com vagas disponíveis
* Inscrição e cancelamento de inscrições
* Duplicação de eventos
* Alteração do status de um evento
* Reinicialização das inscrições

Endpoints

Método	Endpoint	Descrição
GET	/event	Lista todos os eventos
GET	/event/{id}	Busca um evento por ID
GET	/event/events/order/date	Lista eventos ordenados por data
GET	/event/events/count	Retorna a quantidade de eventos
GET	/event/events/today	Lista eventos do dia
GET	/event/events/statistics	Retorna estatísticas gerais
GET	/event/events/packed	Lista eventos lotados
GET	/event/events/notPacked	Lista eventos com vagas disponíveis
POST	/event	Cadastra um novo evento
POST	/event/{id}/duplicate	Duplica um evento
POST	/event/subscribe	Realiza uma inscrição
POST	/event/unsubscribe	Cancela uma inscrição
PATCH	/event/{id}	Atualiza um evento
PATCH	/event/{id}/reset	Remove todas as inscrições
PATCH	/event/{id}/alternate	Alterna o status do evento
DELETE	/event/{id}	Remove um evento

Executando o projeto

Clone o repositório:

git clone https://github.com/nykovas/Api-Gerenciador-de-Eventos.git
cd Api-Gerenciador-de-Eventos

Configure as credenciais do banco de dados no arquivo application.properties e execute o backend:

mvn spring-boot:run

Para executar o frontend:

npm install
npm run dev

Objetivo

Este projeto foi desenvolvido como parte dos meus estudos em desenvolvimento backend com Java e Spring Boot, com foco na implementação de regras de negócio, modelagem de domínio e construção de APIs REST seguindo boas práticas de desenvolvimento.

Autor

Nyk
