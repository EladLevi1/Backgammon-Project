export default class User{
    constructor(
        public id : string = "0",
        public email : string = "",
        public password : string = "",
        public nickname : string = "",
        public image : string = ""
        ) {}
}