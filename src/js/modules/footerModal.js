// import teamModal from '../../templates/teamModal.hbs';

export default function footermdlClick() {
  const refs = {
    openModalBtn: document.querySelector('[data-modal-open]'),
    closeModalBtn: document.querySelector('[data-modal-close]'),
    modal: document.querySelector('[data-modal]'),
    modalDiv: document.querySelector('.data-modal-js'),
  };
  refs.openModalBtn.addEventListener('click', toggleModal);
  refs.closeModalBtn.addEventListener('click', toggleModal);

  function toggleModal() {
    refs.modal.classList.toggle('is-hidden');
  }
}

// (() => {
//   const refs = {
//     openModalBtn: document.querySelector("[data-modal-open]"),
//     closeModalBtn: document.querySelector("[data-modal-close]"),
//     modal: document.querySelector("[data-modal]"),
//   };

//   refs.openModalBtn.addEventListener("click", toggleModal);
//   refs.closeModalBtn.addEventListener("click", toggleModal);

//   function toggleModal() {
//     refs.modal.classList.toggle("is-hidden");
//   }
// });

// refs.modalDiv.innerHTML = teamModal();

// refs.openModalBtn.addEventListener('click', modalWindow.open);
// refs.closeModalBtn.addEventListener('click', modalWindow.close);

// function toggleModal() {
//   refs.modal.classList.toggle('is-hidden');
// }
// if (!document.querySelector('.basicLightbox')) {
//   const modalWindow = basicLightbox.create(refs.modalDiv, {
//     onShow: () => {
//       refs.openModalBtn.removeEventListener('click', modalWindow.open);
//     },
//     onClose: () => {
//       closeModalBtn.removeEventListener('click', modalWindow.close);
//     },
//   });
//   closeModalBtn.addEventListener('click', modalWindow.close);
//   modalWindow.show();
// }
