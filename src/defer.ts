


export class Defer<T> extends Promise<T> {
    
    public resolve: Function
    public reject: Function

    constructor() {
        super((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
    }

}