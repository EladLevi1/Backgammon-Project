import User from "./user.model";

export default class Profile{
    constructor(
        public _id : string = "",
        public nickname : string = "",
        public image : string = "",
        public user : User = new User(),
        public friends : Profile[] =[]
        ) {}
}