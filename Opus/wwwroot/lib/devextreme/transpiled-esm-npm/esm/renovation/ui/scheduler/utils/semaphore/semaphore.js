export class Semaphore {
  constructor() {
    this.counter = 0;
  }

  isFree() {
    return this.counter === 0;
  }

  take() {
    this.counter += 1;
  }

  release() {
    this.counter -= 1;

    if (this.counter < 0) {
      this.counter = 0;
    }
  }

}