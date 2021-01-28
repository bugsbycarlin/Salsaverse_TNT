


class Door extends Line {
  constructor(x1, y1, x2, y2, allowed_directions, action, label="") {
    super(x1, y1, x2, y2, label);

    this.used = false;
    this.action = action;
    this.allowed_directions = allowed_directions;

    this.color = "#FF0000";
  }
}