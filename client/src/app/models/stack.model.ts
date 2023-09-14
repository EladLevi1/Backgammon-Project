export default class Stack{
    constructor(
        public color: 'black' | 'white' | 'none' = 'none',
        public amount : number = 0
    ) {}
}