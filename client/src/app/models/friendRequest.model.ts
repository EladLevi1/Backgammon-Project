import Profile from "./profile.model";

export default class friendRequest {
    constructor(
        public _id: string = "",
        public sender: Profile = new Profile(),
        public recipient: Profile = new Profile(),
        public status: 'accepted' | 'pending' | 'rejected' = 'pending',
        public timestamp: Date = new Date()
    ) {}
}