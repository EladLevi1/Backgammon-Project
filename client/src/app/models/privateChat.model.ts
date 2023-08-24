import ChatMessage from './chatMessage.model';
import Profile from './profile.model';

export default class PrivateChat {
    constructor(
        public _id: string = "",
        public profile1: Profile = new Profile(),
        public profile2: Profile = new Profile(),
        public messages: ChatMessage[] = []
    ) {}
}
