// This file contains custom emojis used in the bot. Each emoji is represented as an instance of the Emoji class, which provides a method to get the string representation of the emoji for use in messages.

class Emoji {
  name: string;
  id: string;
  animated?: boolean;

  constructor(name: string, id: string, animated?: boolean) {
    this.name = name;
    this.id = id;
    this.animated = animated;
  }

  getString() {
    return `<${this.animated ? 'a' : ''}:${this.name}:${this.id}>`;
  }
}

export const CheckGreen = new Emoji('CheckGreen', '1509237408850509875');
export const ChevronDownRed = new Emoji('ChevronDownRed', '1509237424499331132');
export const ChevronLeft = new Emoji('ChevronLeft', '1509237444392784165');
export const ChevronRight = new Emoji('ChevronRight', '1509237481214709830');
export const ChevronUpGreen = new Emoji('ChevronUpGreen', '1509237507793883187');
export const Circle = new Emoji('Circle', '1509237526949531780');
export const CircleXRed = new Emoji('CircleXRed', '1509237546327081001');
export const CoinFlip = new Emoji('CoinFlip', '1509247496793227435', true);
export const Empty = new Emoji('Empty', '1509238426648576030');
export const Loading = new Emoji('Loading', '1509168416873779240', true);
export const MessageCircleQuestionMark = new Emoji('MessageCircleQuestionMark_', '1509605116507066398');
export const RefreshCw = new Emoji('RefreshCw', '1509237585011277976');
export const Search = new Emoji('Search', '1509237614203637962');
export const X = new Emoji('X', '1509237633879113788');
export const XRed = new Emoji('XRed', '1509241654048198686');