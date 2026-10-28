/// <reference types="cypress" />
import { faker } from '@faker-js/faker'
import {
    deleteCurrentAccount,
    loginUser,
    registerUser,
    createUserData,
    openLoginPage,
    addProductsAndOpenCheckout,
    placeOrder
} from '../support/automation-exercise'

describe('Automation Exercise', () => {
    const password = '12345'

    it('Caso de Teste 01: Registrar Usuário', () => {
        const user = createUserData()

        registerUser(user)
        deleteCurrentAccount()
    })

    it('Caso de Teste 02: Login com email e senha corretos', () => {
        const user = createUserData()

        registerUser(user)
        cy.get('a[href*="logout"]').click()
        openLoginPage()
        loginUser(user)

        deleteCurrentAccount()
    })

    it('Caso de Teste 03: Login com e-mail e senha incorretos', () => {
        openLoginPage()
        cy.get('[data-qa="login-email"]').type(`invalid-${faker.string.uuid()}@mail.com`)
        cy.get('[data-qa="login-password"]').type('senha-incorreta')
        cy.get('[data-qa="login-button"]').click()

        cy.contains('Your email or password is incorrect!').should('be.visible')
    })

    it('Caso de Teste 04: Deslogar Usuário', () => {
        const user = createUserData()

        registerUser(user)
        cy.get('a[href*="logout"]').click()

        cy.url().should('include', '/login')
        cy.contains('Login to your account').should('be.visible')

        openLoginPage()
        loginUser(user)

        deleteCurrentAccount()
    })

    it('Caso de Teste 05: Cadastrar um usuário com um endereço de email que já existe', () => {
        const user = createUserData()

        registerUser(user)
        cy.get('a[href*="logout"]').click()
        openLoginPage()
        cy.get('[data-qa="signup-name"]').type(user.name)
        cy.get('[data-qa="signup-email"]').type(user.email)
        cy.get('[data-qa="signup-button"]').click()

        cy.contains('Email Address already exist!').should('be.visible')

        openLoginPage()
        loginUser(user)

        deleteCurrentAccount()
    })

    it('Caso de Teste 08: Verificar todos os produtos e a página de detalhes do produto', () => {
        cy.visit('https://www.automationexercise.com')
        cy.contains('Full-Fledged practice website for Automation Engineers').should('be.visible')
        cy.get('a[href*="products"]').first().click()

        cy.contains('All Products').should('be.visible')
        cy.get('.features_items .product-image-wrapper').should('be.visible')
        cy.get('.features_items a[href*="/product_details/"]').first().click()

        cy.url().should('include', '/product_details/')
        cy.get('.product-information h2').should('be.visible')
        cy.get('.product-information').should('contain.text', 'Category:')
            .and('contain.text', 'Rs.')
            .and('contain.text', 'Availability:')
            .and('contain.text', 'Condition:')
            .and('contain.text', 'Brand:')
    })

    it('Caso de Teste 09: Pesquisar produtos', () => {
        cy.visit('https://www.automationexercise.com')
        cy.contains('Full-Fledged practice website for Automation Engineers').should('be.visible')
        cy.get('a[href*="products"]').first().click()
        cy.contains('All Products').should('be.visible')

        cy.get('#search_product').type('top')
        cy.get('#submit_search').click()

        cy.contains('Searched Products').should('be.visible')
        cy.get('.features_items .product-image-wrapper')
            .should('have.length.greaterThan', 0)
            .each(($product) => {
                cy.wrap($product)
                    .find('.productinfo p')
                    .should('be.visible')
            })
    })

    it('Caso de Teste 10: Verificar a inscrição na página inicial', () => {
        cy.visit('https://www.automationexercise.com')
        cy.contains('Full-Fledged practice website for Automation Engineers').should('be.visible')
        cy.get('footer').scrollIntoView()
        cy.contains('Subscription').should('be.visible')

        cy.get('#susbscribe_email').type(`automation-${faker.string.uuid()}@mail.com`)
        cy.get('#subscribe').click()

        cy.get('#success-subscribe')
            .should('be.visible')
            .and('contain.text', 'You have been successfully subscribed!')
    })

    it('Caso de Teste 15: Fazer pedido registrando antes do checkout', () => {
        const user = createUserData()

        registerUser(user)
        addProductsAndOpenCheckout()
        placeOrder(user)
        deleteCurrentAccount()
    })

    it('Caso de Teste 16: Fazer pedido entrando na conta antes do checkout', () => {
        const user = createUserData()

        registerUser(user)
        cy.get('a[href*="logout"]').click()
        loginUser(user)
        addProductsAndOpenCheckout()
        placeOrder(user)
        deleteCurrentAccount()
    })
})