/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
	beforeEach(() => {
		cy.visit('./src/index.html');
	});

	it('preenche os campos obrigatórios e envia o formulário', () => {
		cy.get('#firstName').type('Beatriz');
		cy.get('#lastName').type('Lira');
		cy.get('#email').type('beatriz@gmail.com');
		cy.get('#open-text-area').type('Dúvida sobre a Aula X do curso', {
			delay: 5,
		});

		cy.contains('button', 'Enviar').should('be.visible').click();

		cy.get('span.success').should('be.visible');
	});

	it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
		cy.get('#firstName').type('Beatriz').should('have.value', 'Beatriz');

		cy.get('#lastName').type('Lira').should('have.value', 'Lira');

		cy.get('#open-text-area')
			.type('Dúvida sobre a Aula X do curso', {
				delay: 0,
			})
			.should('have.value', 'Dúvida sobre a Aula X do curso');

		cy.get('#email').type('beatriz@gmail');

		cy.get('button').click();

		cy.get('span.error').should('be.visible');
	});

	it('campo telefone continua vazio quando preenchido com valor não numérico', () => {
		cy.get('#phone').type('abcd').should('be.empty');
	});

	it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
		cy.get('#firstName').type('Beatriz');
		cy.get('#lastName').type('Lira');
		cy.get('#email').type('beatriz@gmail');
		cy.get('#phone-checkbox').click();
		cy.get('#open-text-area').type('Dúvida sobre a Aula X do curso');
		cy.get('button').click();

		cy.get('span.error').should('be.visible');
	});

	it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
		cy.get('#firstName')
			.type('Beatriz')
			.should('have.value', 'Beatriz')
			.clear()
			.should('be.empty');
		cy.get('#lastName')
			.type('Lira')
			.should('have.value', 'Lira')
			.clear()
			.should('be.empty');
		cy.get('#email')
			.type('beatriz@gmail')
			.should('have.value', 'beatriz@gmail')
			.clear()
			.should('be.empty');
		cy.get('#phone')
			.type('1199999999')
			.should('have.value', '1199999999')
			.clear()
			.should('be.empty');
	});

	it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
		cy.contains('button', 'Enviar').click();
		cy.get('span.error').should('be.visible');
	});

	it('envia o formulário com sucesso utilizando um comando customizado', () => {
		cy.fillMandatoryFieldsAndSubmit();
		cy.get('span.success').should('be.visible');
	});

	it('seleciona um produto (YouTube) por seu texto', () => {
		cy.get('select#product').select('YouTube').should('have.value', 'youtube');
	});

	it('seleciona um produto (Mentoria) por seu valor (value)', () => {
		cy.get('select#product')
			.select('mentoria')
			.should('have.value', 'mentoria');
	});

	it('seleciona um produto (Blog) por seu índice', () => {
		cy.get('select#product').select(1).should('have.value', 'blog');
	});

	it('marca o tipo de atendimento "Feedback"', () => {
		cy.get('input[type="radio"][value="feedback"]')
			.check()
			.should('have.value', 'feedback');
	});

	it.only('marca cada tipo de atendimento', () => {
		cy.get('input[type="radio"]')
			.should('have.length', 3)
			.each(($radio) => {
				cy.wrap($radio).check();
				cy.wrap($radio).should('be.checked');
			});
	});
});
