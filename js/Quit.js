
class Quit{
    constructor(){
        window.addEventListener("keydown", (evt) => {
            try{
                this["key_" + evt.keyCode](evt);
            }catch(e){
                console.log("This keycode(" + evt.keyCode + ") have not been registed...");
            }
        });
    }
    key_27(evt){
        //这个方法用于关闭设置栏
        const defaultExitObj = document.querySelector("#bg-setting");
        defaultExitObj.style.display = 'none';
    }
};

export{Quit}