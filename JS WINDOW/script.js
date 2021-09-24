/**
 * Получить ссылку на элемент кнопки по его ID
 * @type {HTMLButtonElement}
 */
let buttonCreateWindow = document.querySelector("#ButtonCreateWindow");
// Проверить, что кнопку удалось получить (не null)
if (buttonCreateWindow) {
    // Для этой кнопки установить событие на клик мыши
    buttonCreateWindow.onclick = createWindow;
}
// Переменная-счетчик необходима для установки позиции по оси Z активного окна
// чтобы активное окно было всегда повех всех остальных
let zIndex = 1;
/**
 * Создание нового окна
 * @param {MouseEvent} event
 */
var freeRoom = [0,0,0,0,0,0,0,0,0];

function createWindow(event) {
    /**
     * Создание структуры HTML
     * <div class="window">
     *     <div class="head">
     *         <div>Текст заголовка окна</div>
     *         <div class="close"></div>
     *     </div>
     *     <div class="body"></div>
     * </div>
     */

    let rootWindow = document.createElement("div"),
        head = document.createElement("div"),
        body = document.createElement("div"),
        headerText = document.createElement("div"),
        minimize = document.createElement("div"),
        close = document.createElement("div");

    rootWindow.append(head, body);
    head.append(headerText, close,minimize);

    // События на заголовок для перемещения окна
    head.onmousedown = onMouseDown;
    head.onmousemove = onMouseMove;
    head.onmouseup = onMouseUp;

    headerText.textContent = "Это окно";

    rootWindow.className = "window";
    head.className = "head";
    body.className = "body";
    close.className = "close";
    minimize.className = "minimize"

    // Событие на кнопку "Закрыть"
    close.onclick = closeWindow;
    minimize.onclick = minimizeWindow;
    

    // Добавить созданное окно в конец тела страницы
    document.body.append(rootWindow);
}
/**
 * @param {MouseEvent} event
 */
function closeWindow(event) {
    // Для закрытия окна получаем родительский элемент текущего
    // элемента (т.е. кнопки закрыть) с классом .window
    let thisWindow = this.closest(".window");
    if (thisWindow) {
        // И если его нашли - удаляем
        thisWindow.remove();
    }
    
}

function minimizeWindow(event) {
    let thisWindow = this.closest(".window");
    if(isHidden(thisWindow) == "false"){
        if(getFreeRoomLast() == -1){
            alert("Панель своротов заполнена")
            return;
        }
        thisWindow.style.position = "fixed";
        thisWindow.style.bottom = "-174px"
        setPrevPositionTop(thisWindow);
        setPrevPositionLeft(thisWindow);
        thisWindow.style.top = null;
        setHidden(thisWindow,"true");
        thisWindow.style.left = (getFreeRoomLast() * 210) + "px";
        thisWindow.indexx = getFreeRoomLast();
        freeRoom[getFreeRoomLast()] = 1;
    }else{
        thisWindow.style.bottom = null;
        setHidden(thisWindow,"false");
        thisWindow.style.top = getPrevPositionTop(thisWindow);
        thisWindow.style.left = getPrevPositionLeft(thisWindow);
        freeRoom[thisWindow["indexx"]] = 0;
    }
}

function setHidden(el,isHidden){
    el.myHidden = isHidden;
}

function setPrevPositionTop(el){
     el.savePosTop = el.style.top;
}
function getPrevPositionTop(el){
    return el["savePosTop"];
}
function setPrevPositionLeft(el){
     el.savePosLeft = el.style.left;
}
function getPrevPositionLeft(el){
    return el["savePosLeft"];
}

function getFreeRoomLast(){
    return freeRoom.indexOf(freeRoom.find(el => el == 0));
}
function isHidden(element){
    if(element.hasOwnProperty("myHidden")){
        return element["myHidden"];
    }else{
        return "false";
    }
}

/**
 * @param {MouseEvent} event
 */
function onMouseDown(event) {
    if(isHidden(this.parentElement) == "true") return;
    // Установить флажок на текущее окно, говоря, что его можно перемещать
    // Событие onmousemove будет работать для этого элемента, если значение "true
    this.dataset.isMove = "true";
    // Сохранить текущую позицию мыши, чтобы потом найти разницу между предыдущей
    // и текущей позицией мыши
    this.dataset.x = "" + event.clientX;
    this.dataset.y = "" + event.clientY;
    // Установить на текущее окно позицию по оси Z выше, чем у кого-либо
    this.parentElement.style.zIndex = "" + (zIndex++);
}
/**
 * @param {MouseEvent} event
 */
function onMouseUp(event) {
    this.dataset.isMove = "false";
}
/**
 * @param {MouseEvent} event
 */
function onMouseMove(event) {
    if(isHidden(this.parentElement) == "true") return;
    if (this.dataset.isMove !== "true") return;

    // Разница позиции курсора текущего кадра с предыдущим
    let x = event.clientX - +this.dataset.x;
    let y = event.clientY - +this.dataset.y;

    let bound = this.parentElement.getBoundingClientRect();

    this.parentElement.style.left = `${bound.left + x}px`;
    this.parentElement.style.top = `${bound.top + y}px`;

    this.dataset.x = "" + event.clientX;
    this.dataset.y = "" + event.clientY;
}