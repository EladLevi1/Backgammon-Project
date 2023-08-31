import Profile from "./profile.model";

export default class Notification {
    constructor(
        public _id: string = "",
        public profile: Profile = new Profile(),
        public content: string = "",
        public status: 'read' | 'unread' = 'unread',
        public timestamp: Date = new Date()
    ) {}
}
