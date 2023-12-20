Cypress.Commands.add('fillMandatoryFieldsAndSubmit', () => {
	cy.get('#firstName').type('Beatriz');
	cy.get('#lastName').type('Lira');
	cy.get('#email').type('beatriz@gmail.com');
	cy.get('#open-text-area').type('Dúvida sobre a Aula X do curso', {
		delay: 0,
	});
	cy.contains('button', 'Enviar').should('be.visible').click();
});
