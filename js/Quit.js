
class Quit{
    constructor(){
        window.addEventListener("keydown", (evt) => {
            try{
                this.evt = evt;
                this["key_" + evt.keyCode](evt);
            }catch(e){
                console.log("This keycode(" + evt.keyCode + ") have not been registed...");
            }
        });
    }
    getTarget(evt){
        if(!evt) evt = this.evt;
        return evt.target||evt.srcElement;
    }
    inSearch(evt){
        return this.getTarget(evt).className == 'search-input';
    }
    key_27(evt){
        //这个方法用于关闭设置栏
        const defaultExitObj = document.querySelector("#bg-setting");
        defaultExitObj.style.display = 'none';
        if(this.inSearch())
            this.getTarget().blur();
    }
    key_81(evt){
        //这个方法用于关闭设置栏
        const defaultExitObj = document.querySelector("#bg-setting");
        defaultExitObj.style.display = 'none';
    }
    key_73(evt){
        if(!this.inSearch()){
            let ele = document.querySelector(".search-input");
            ele.focus();
            setTimeout(() => {
                ele.value = ele.value.slice(0, -1);
            }, 100);
        }
    }
    key_79(evt){
        if(!this.inSearch()){
            const defaultExitObj = document.querySelector("#bg-setting");
            defaultExitObj.style.display = 'block';
        }
    }
    key_74(evt){
        const setting = document.querySelector("#bg-setting");
        if(setting.style.display == 'block'){
            const inner = setting.querySelector(".setting");
            inner.scrollTop += 20;
        }
    }
    key_75(evt){
        const setting = document.querySelector("#bg-setting");
        if(setting.style.display == 'block'){
            const inner = setting.querySelector(".setting");
            inner.scrollTop -= 20;
        }
    }
};

export{Quit}