import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    // Doing event delegation because we don't to need to listen to 2 buttons individually then
    this._parentElement.addEventListener('click', e => {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline'); // searches up in the tree for parent

      const goToPage = parseInt(btn.dataset.goto);
      console.log(goToPage);

      console.log(btn);

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    console.log(numPages);

    // Page 1, and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupBtn('right', curPage);
    }

    // Last page
    if (numPages === curPage && numPages > 1) {
      return this._generateMarkupBtn('left', curPage);
    }

    // Other
    if (curPage < numPages && numPages > 1) {
      return `
      ${this._generateMarkupBtn('left', curPage)}${this._generateMarkupBtn(
        'right',
        curPage
      )}
      `;
    }

    // Page 1, and there are no other page
    return '';
  }

  _generateMarkupBtn(dir, curPage) {
    return dir === 'left'
      ? `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span>Page ${curPage - 1}</span>
      </button>`
      : `
      <button data-goto="${
        curPage + 1
      }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
      `;
  }
}

export default new PaginationView();
