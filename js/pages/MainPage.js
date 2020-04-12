export default class MainPage {
    constructor(context) {
        this._context = context;
        this._rootEl = context.rootEl();
        this._point = "";
        this._pointType = "";
        this._pointText = "";
    }

    init() {
        this._rootEl.innerHTML = `
        <button type="button" data-id="start" class="btn btn-primary btn-lg btn-block">Купить химикаты</button>
        
        <div data-id="text"></div>
        <div data-id="yes"></div>
        <div data-id="no"></div>
        <div data-id="continue"></div>
        <div data-id="end"></div>
        
        <div class="modal fade" data-id="error-modal" tabindex="-1">
        <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Error!</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
        </button>
        </div>
        <div data-id="error-message" class="modal-body"></div>
        <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
        </div>
        </div>
        </div>
    `;

        this._rootEl.querySelector('[data-id=start]').addEventListener('click', evt => {
            this._context.get("/start", {},
                rsp => {
                    const data = JSON.parse(rsp);
                    this._point = data.pointId;
                    this._pointType = data.pointType;
                    this._pointText = data.pointText;
                    this.showCard(this._pointText, this._pointType);
                },
                error => {
                    this.showError(error);
                })
        });

        this._text = this._rootEl.querySelector('[data-id=text]');
        this._yes = this._rootEl.querySelector('[data-id=yes]');
        this._no = this._rootEl.querySelector('[data-id=no]');
        this._continue = this._rootEl.querySelector('[data-id=continue]');
        this._end = this._rootEl.querySelector('[data-id=end]');

        this._yes.addEventListener('click', evt => {
            this.getAnswer(true);
        });

        this._no.addEventListener('click', evt => {
            this.getAnswer(false);
        });

        this._continue.addEventListener('click', evt => {
            this.getAnswer(false);
        });

        this._errorModal = $('[data-id=error-modal]');
        this._errorMessageEl = this._rootEl.querySelector('[data-id=error-message]');

    }

    getAnswer(answer) {
        const data = {
            point: this._point,
            answer: answer
        };
        this._context.post("/answer", JSON.stringify(data), {'Content-Type': 'application/json'},
            rsp => {
                const data = JSON.parse(rsp);
                this._point = data.pointId;
                this._pointType = data.pointType;
                this._pointText = data.pointText;
                this.showCard(this._pointText, this._pointType);
            },
            error => {
                this.showError(error);
            });
    }

    showCard(text, type) {
        this._text.innerHTML = `
        <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <p class="lead">${text}</p>
          </div>
        </div>
        `;
        switch (type) {
            case "Q":
                this._yes.innerHTML = `
                <button data-id="yes" type="button" class="btn btn-success btn-lg btn-block">Да</button>
                `;
                this._no.innerHTML = `
                <button data-id="no" type="button" class="btn btn-danger btn-lg btn-block">Нет</button>
                `;
                this._continue.innerHTML = ``;
                this._end.innerHTML = ``;
                break;
            case "R":
                this._yes.innerHTML = ``;
                this._no.innerHTML = ``;
                this._continue.innerHTML = ``;
                this._end.innerHTML = `
                <div class="alert alert-success" role="alert">
                  Конец
                </div>
                `;
                break;
        }
    }

    showError(error) {
        const data = JSON.parse(error);
        this._errorMessageEl.textContent = data.message;
        this._errorModal.modal('show');
    }

    destroy() {
        clearTimeout(this._timeout);
    }
}