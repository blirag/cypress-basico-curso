/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
	beforeEach(() => {
		cy.visit('./src/index.html');
	});

	it('preenche os campos obrigatórios e envia o formulário', () => {
		cy.clock();

		cy.get('#firstName').type('Beatriz');
		cy.get('#lastName').type('Lira');
		cy.get('#email').type('beatriz@gmail.com');
		cy.get('#open-text-area').type('Dúvida sobre a Aula X do curso', {
			delay: 5,
		});
		cy.contains('button', 'Enviar').should('be.visible').click();

		cy.get('span.success').should('be.visible');
		cy.tick(3000);
		cy.get('span.success').should('not.be.visible');
	});

	it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
		cy.clock();
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
		cy.tick(3000);
		cy.get('span.error').should('not.be.visible');
	});

	it('campo telefone continua vazio quando preenchido com valor não numérico', () => {
		cy.get('#phone').type('abcd').should('be.empty');
	});

	it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
		cy.clock();
		cy.get('#firstName').type('Beatriz');
		cy.get('#lastName').type('Lira');
		cy.get('#email').type('beatriz@gmail');
		cy.get('#phone-checkbox').check();
		cy.get('#open-text-area').type('Dúvida sobre a Aula X do curso');
		cy.get('button').click();

		cy.get('span.error').should('be.visible');
		cy.tick(3000);
		cy.get('span.error').should('not.be.visible');
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
		cy.clock();
		cy.contains('button', 'Enviar').click();
		cy.get('span.error').should('be.visible');
		cy.tick(3000);
		cy.get('span.error').should('not.be.visible');
	});

	it('envia o formulário com sucesso utilizando um comando customizado', () => {
		Cypress._.times(2, () => {
			cy.clock();
			cy.fillMandatoryFieldsAndSubmit();
			cy.get('span.success').should('be.visible');
			cy.tick(3000);
			cy.get('span.success').should('not.be.visible');
		});
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

	it('marca cada tipo de atendimento', () => {
		cy.get('input[type="radio"]')
			.should('have.length', 3)
			.each(($radio) => {
				cy.wrap($radio).check();
				cy.wrap($radio).should('be.checked');
			});
	});

	it('marca ambos checkboxes, depois desmarca o último', () => {
		cy.get('input[type="checkbox"]')
			.check()
			.should('be.checked')
			.last()
			.uncheck()
			.should('not.be.checked');
	});

	it('seleciona um arquivo da pasta fixtures', () => {
		cy.get('input[type="file"]#file-upload')
			.should('not.have.value')
			.selectFile('./cypress/fixtures/example.json')
			.should(($input) => {
				expect($input[0].files[0].name).to.equal('example.json');
			});
	});

	it('seleciona um arquivo simulando um drag-and-drop', () => {
		cy.get('input[type="file"]#file-upload')
			.should('not.have.value')
			.selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
			.should(($input) => {
				expect($input[0].files[0].name).to.equal('example.json');
			});
	});

	it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
		cy.fixture('example.json').as('sampleFile');
		cy.get('input[type="file"]#file-upload')
			.selectFile('@sampleFile') // sempre usar @ na frente para identificar que é um alias
			.should(($input) => {
				expect($input[0].files[0].name).to.equal('example.json');
			});
	});

	it('verifica que a política de privacidade abre em outra aba sem a necessidade de clique', () => {
		cy.get('#privacy a').should('have.attr', 'target', '_blank');
	});

	it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
		cy.get('#privacy a').invoke('removeAttr', 'target').click();
		cy.contains('Talking About Testing').should('be.visible');
	});

	it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
		cy.get('.success')
			.should('not.be.visible')
			.invoke('show')
			.should('be.visible')
			.and('contain', 'Mensagem enviada com sucesso.')
			.invoke('hide')
			.should('not.be.visible');
		cy.get('.error')
			.should('not.be.visible')
			.invoke('show')
			.should('be.visible')
			.and('contain', 'Valide os campos obrigatórios!')
			.invoke('hide')
			.should('not.be.visible');
	});

	it('preenche a area de texto usando o comando invoke', () => {
		const longText = Cypress._.repeat('0123456789', 20);
		cy.get('#open-text-area')
			.invoke('val', longText)
			.should('have.value', longText);
	});

	it('faz uma requisição HTTP', () => {
		cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html').then(
			(response) => {
				expect(response.status).to.equal(200);
				expect(response.statusText).to.equal('OK');
				expect(response.body).to.includes('CAC TAT');
			}
		);
	});

	it.only('encontra o gato escondido', () => {
		cy.get('#cat').invoke('show').should('be.visible');
	});
});
