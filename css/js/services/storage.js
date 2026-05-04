export class CarritoStorage{
    constructor(key = "cart"){
        this.key = key;
    }

    setCarrito(carrito){
        const jsonString = JSON.stringify(carrito);

        localStorage.setItem(this.key, btoa(jsonString));
    }

    getCarrito(){
        let carrito = localStorage.getItem(this.key);

        if(!carrito) return [];

        let jsonString = atob(carrito);

        return JSON.parse(jsonString);
    }
}

export const storage = new CarritoStorage();