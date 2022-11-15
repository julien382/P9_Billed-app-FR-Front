/**
 * @jest-environment jsdom
 */

 import { screen, waitFor } from "@testing-library/dom"
 import BillsUI from "../views/BillsUI.js"
 import { bills } from "../fixtures/bills.js"
 import { ROUTES_PATH } from "../constants/routes.js";
 import { localStorageMock } from "../__mocks__/localStorage.js";
 import router from "../app/Router.js";
 import mockedStore from "../__mocks__/store.js" 

 describe("Given I am connected as an employee", () => {
   describe("When I am on Bills Page", () => {
     test("Then bill icon in vertical layout should be highlighted", async () => {
 
       Object.defineProperty(window, 'localStorage', { value: localStorageMock })
       window.localStorage.setItem('user', JSON.stringify({
         type: 'Employee'
       }))
 
       const root = document.createElement("div")
       root.setAttribute("id", "root")
       document.body.append(root)
       router()
       window.onNavigate(ROUTES_PATH.Bills)
 
       await waitFor(() => screen.getByTestId('icon-window'))
       const windowIcon = screen.getByTestId('icon-window')
       await waitFor(() => screen.getByTestId('icon-mail'))
       const mailIcon = screen.getByTestId('icon-mail')
 
       expect(windowIcon.classList.contains('active-icon')).toBeTruthy()
       expect(mailIcon.classList.contains('active-icon')).not.toBeTruthy()
 
     })
     test("Then bills should be ordered from earliest to latest", async () => {
       document.body.innerHTML = BillsUI({ data: bills })
       const dates = screen.getAllByText(/^[0-9]{2}\s\w{3}\.\s[0-9]{2}$/gm).map(a => a.innerHTML)
       console.log(dates);
       const antiChrono = (a, b) => a - b;
       const datesSorted = [...dates].sort(antiChrono)
       expect(dates).toEqual(datesSorted)
     })
/*
     test("Then bills ", async () => {
       const pageBill = new PageBill({xxx, zzz, yyy})
       const handleShowTickets1 = jest.fn((e) => pageBill.handleClickNewBill())
   
       const icon1 = screen.getByTestId('arrow-icon1')
   
       icon1.addEventListener('click', handleShowTickets1)
   
       userEvent.click(icon1)
   
       expect(handleShowTickets1).toHaveBeenCalled()
      
    })

    test("Then the method getBill should return bills", () => {
      const bill = new Bills({document, onNavigate: null, store: mockedStore, localStorage: null})
      return bill.getBills().then((data) => {
        expect(data).toEqual(bills)
      })
    })*/

   })
 }) 