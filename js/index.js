class UIGoods {
    constructor(goods) {
        // this.data = goods;
        // this.choose = 0;
        Object.defineProperty(this, 'data', {
            get() {
                return goods;
            },
            set() {
                throw new Error('不可修改');
            },
            configurable: false
        });

        var internalChooseValue = 0;
        Object.defineProperty(this, 'choose', {
            get() {
                return internalChooseValue;
            },
            set(value) {
                if (typeof value !== 'number') {
                    throw new Error('choose属性必须为数字');
                }
                var temp = parseInt(value);
                if (temp !== value) {
                    throw new Error('choose属性必须为正整数');
                }
                if (value < 0) {
                    throw new Error('choose属性必须大于等于0');
                }
                internalChooseValue = value;
            },
            configurable: false
        });
    }

    //获取总价
    get totalPrice() {
        return this.choose * this.data.price;
    }

    //是否选中了此商品
    get isChoose() {
        return this.choose > 0;
    }

    //获取总价
    // getTotalPrice() {
    //     return this.data.price * this.choose
    // }

    //是否选中了此商品
    // isChoose() {
    //     return this.choose > 0
    // }

    //选中商品+1
    increase() {
        this.choose++;
    }

    //选中商品-1
    decrease() {
        if (this.choose === 0) {
            return;
        }
        this.choose--;
    }
}

//整个界面的数据
class UIDatas {
    constructor() {
        var uiGoods = [];
        for (let i = 0; i < goods.length; i++) {
            var uig = new UIGoods(goods[i]); 
            uiGoods.push(uig);
        }
        this.uiGoods = uiGoods;
        this.deliveryThreshold = 30;
        this.deliveryPrice = 5;
    }

    //获取总价
    getTotalPrice() {
        var sum = 0;
        for (let i = 0; i < this.uiGoods.length; i++) {
            var g = this.uiGoods[i];
            sum += g.totalPrice;
        }
        return sum;
    }

    //增加某件商品的选中数量
    increase(index) {
        this.uiGoods[index].increase();
    }

    //减少某件商品的选中数量
    decrease(index) {
        this.uiGoods[index].decrease();
    }

    //获取总共选中的数量
    getTotalChooseNumber() {
        var sum = 0;
        for (let i = 0; i < this.uiGoods.length; i++) {
            sum += this.uiGoods[i].choose;
        }
        return sum;
    }

    //有没有选中商品
    hasGoodsInCar() {
        return this.getTotalChooseNumber() > 0;
    }

    //是否跨过了配送门槛 
    isCrossDeliveryThreshold() {
        return this.getTotalPrice() >= this.deliveryThreshold;
    }

    isChoose(index) {
        return this.uiGoods[index].isChoose;
    }
}

//整个界面
class UI {
    constructor() {
        this.uiData = new UIDatas();
        this.doms = {
            goodsContainer: document.querySelector('.goods-list'),
            deliveryPrice: document.querySelector('.footer-car-tip'),
            footerPay: document.querySelector('.footer-pay'),
            footerInnerSpan: document.querySelector('.footer-inner span'),
            totalPrice: document.querySelector('.footer-car-total'),
            car: document.querySelector('.footer-car'),
            badge: document.querySelector('.footer-car-badge'),
        };

        var carRect = this.doms.car.getBoundingClientRect();
        var jumpTarget = {
            x: carRect.left + carRect.width / 2,
            y: carRect.top + carRect.height / 5,
        }
        this.jumpTarget = jumpTarget;

        this.createHTML();
        this.updateFooter();
        this.listenEvent();
    }

    //监听各种事件
    listenEvent() {
        this.doms.car.addEventListener("animationend", () => {
            this.classList.remove("animate");
        });
    }
    
    //根据商品数据创建商品列表元素
    createHTML() {
        var html = '';
        for(var i = 0; i < this.uiData.uiGoods.length; i++) {
            var g = this.uiData.uiGoods[i];
            html += `<div class="goods-item">
            <img src="${g.data.pic}" alt=""  class="goods-pic" />
            <div class="goods-info">
                <h2 class="goods-title">${g.data.title}</h2>
                <p class="goods-desc">${g.data.desc}</p>
                <p class="goods-sell">
                    <span>月售${g.data.sellNumber}份</span>
                    <span>好评率${g.data.favorRate}</span>
                </p>
                <div class="goods-confirm">
                    <p class="goods-price">
                        <span class="goods-price-unit">¥</span>
                        <span>${g.data.price}</span>
                    </p>
                    <div class="goods-btns">
                        <i index="${i}" class="iconfont icon-add"></i>
                        <span>${g.choose}</span>
                        <i index="${i}" class="iconfont icon-reduce"></i>
                    </div>
                </div>
            </div>
            </div>`
        }
        this.doms.goodsContainer.innerHTML = html;
    }

    increase(index) {
        this.uiData.increase(index);
        this.updateGoodsItem(index);
        this.updateFooter();
        this.jump(index);
    }

    decrease(index) {
        this.uiData.decrease(index);
        this.updateGoodsItem(index);
        this.updateFooter();
    }

    //更新某个商品元素的显示状态
    updateGoodsItem(index) {
        var goodsDom = this.doms.goodsContainer.children[index];
        if(this.uiData.isChoose(index)) {
            goodsDom.classList.add("active");
        } else {
            goodsDom.classList.remove("active");
        }

        var span = goodsDom.querySelector(".goods-btns span");
        span.textContent = this.uiData.uiGoods[index].choose;
    }

    //更新页脚
    updateFooter() {
        //得到总价数据
        var total = this.uiData.getTotalPrice();
        this.doms.deliveryPrice.textContent = `配送费¥${this.uiData.deliveryPrice}`;

        //设置起送费还差多少
        if(this.uiData.isCrossDeliveryThreshold()) {
            //到达起送点
            this.doms.footerPay.classList.add("active");
        } else {
            this.doms.footerPay.classList.remove("active");
            //更新还差多少钱
            var dis = this.uiData.deliveryThreshold - total;
            dis = Math.round(dis);
            this.doms.footerInnerSpan.textContent = `还差¥${dis}元起送`;
        }

        //设置总价元素
        this.doms.totalPrice.textContent = total.toFixed(2);

        //设置购物车的样式状态
        if(this.uiData.hasGoodsInCar()){
            this.doms.car.classList.add("active");
        } else {
            this.doms.car.classList.remove("active");
        }

        //设置购物车中的数量
        this.doms.badge.textContent = this.uiData.getTotalChooseNumber();
    }

    //购物车动画
    carAnimate() {
        this.doms.car.classList.add("animate");
    }

    //抛物线跳跃的元素
    jump(index) {
        //找到对应商品的加号
        var btnAdd = this.doms.goodsContainer.children[index].querySelector(".icon-add");
        var rect = btnAdd.getBoundingClientRect();
        var start = {
            x: rect.left,
            y: rect.top
        };

        var div = document.createElement("div");
        div.className = "add-to-car";
        var i = document.createElement("i");
        i.className = "iconfont icon-add";

        //设置初始位置
        div.style.transform = `translateX(${start.x}px)`;
        i.style.transform = `translateY(${start.y}px)`;
        div.appendChild(i);
        document.body.appendChild(div);

        //强行渲染
        div.clientWidth;

        //设置结束位置
        div.style.transform = `translateX(${this.jumpTarget.x}px)`;
        i.style.transform = `translateY(${this.jumpTarget.y}px)`;

        var that = this;
        div.addEventListener('transitionend', ()=>{
            div.remove();
            that.carAnimate();
        }, {
            once: true
        });
    }
}
var ui = new UIDatas();

//事件
ui.doms.goodsContainer.addEventListener("click", (e) => {
    if(e.target.classList.contains("icon-add")){
        var index = +e.target.getAttribute("index");
        ui.increase(index);
    } else if(e.target.classList.contains("icon-reduce")) {
        var index = +e.target.getAttribute("index");
        ui.decrease(index);
    }
});
