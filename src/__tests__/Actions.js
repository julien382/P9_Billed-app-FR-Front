/**
 * @jest-environment jsdom
 */

 import { screen, waitFor } from "@testing-library/dom"
 import Actions from "../views/Actions.js"
 import '@testing-library/jest-dom/extend-expect'
 
 describe('Given I am connected as an Employee', () => {
   describe('When I am on Bills page and there are bills', () => {
     test(('Then, it should render icon eye'), async () => {
       const html = Actions()
       document.body.innerHTML = html
       await waitFor(() => screen.getByTestId('icon-eye'))
 
       expect(screen.getByTestId('icon-eye')).toBeTruthy()
     })
   })
   describe('When I am on Bills page and there are bills with url for file', () => {
     test(('Then, it should save given url in data-bill-url custom attribute'), async () => {
       const url = '/fake_url'
       const html = Actions(url)
       document.body.innerHTML = html
       await waitFor(() => screen.getByTestId('icon-eye'))
 
       expect(screen.getByTestId('icon-eye')).toHaveAttribute('data-bill-url', url)
     })
   })
 })
 
