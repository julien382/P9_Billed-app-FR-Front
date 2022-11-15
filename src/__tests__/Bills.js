/**
 * @jest-environment jsdom
 */

 import { screen, waitFor, fireEvent } from "@testing-library/dom";
 import BillsUI from "../views/BillsUI.js";
 import { bills } from "../fixtures/bills.js";
 import {  ROUTES, ROUTES_PATH } from "../constants/routes.js";
 import { localStorageMock } from "../__mocks__/localStorage.js";
 import Bills from "../containers/Bills.js";
 import mockStore from "../__mocks__/store";
 
 import router from "../app/Router.js";
 jest.mock("../app/Store", () => mockStore)

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
       const antiChrono = (a, b) => a - b;
       const datesSorted = [...dates].sort(antiChrono)
       expect(dates).toEqual(datesSorted)
     })
   })
 });

 describe("when I click on the IconEye", () => {//Lorsque je clique sur l'icône œil
  test("Then modal should open", () => {//Ensuite, la modale devrait s'ouvrir
    Object.defineProperty(window, localStorage, { value: localStorageMock });//simule des données dans le localstorage
    window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }));//on simule en utilisateur connécter de type employé
    document.body.innerHTML = BillsUI({ data: bills })//création de la constante la modale facture de l'employé

    const onNavigate = (pathname) => {//navigation vers la route bills
      document.body.innerHTML = ROUTES({ pathname });
    };

    const billsContainer = new Bills({//creation d'une facture
      document,
      onNavigate,
      localStorage: localStorageMock,
      store: null,
    });

    //MOCK de la modale
    $.fn.modal = jest.fn();//affichage de la modale

    //MOCK L'ICÔNE DE CLIC
    const handleClickIconEye = jest.fn(() => {//fonction qui simule un click
      billsContainer.handleClickIconEye;
    });
    const firstEyeIcon = screen.getAllByTestId("icon-eye")[0];
    firstEyeIcon.addEventListener("click", handleClickIconEye);//surveil un événement au click sur l'oeil
    fireEvent.click(firstEyeIcon);//click sur l'icone
    expect(handleClickIconEye).toHaveBeenCalled();//vérifie si l'evenement au click a été appeler
    expect($.fn.modal).toHaveBeenCalled();// vérifie si la modale est appeler
  });
});