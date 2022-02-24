document.addEventListener("DOMContentLoaded", async function () {
  const canvas = document.getElementById("drawground");
  const ctx = canvas.getContext("2d");
  const padding = 50;
  const width = 800;
  const height = 400;

  let points = [
    [padding, 200],
    [width - padding, 200],
  ];

  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  ctx.lineTo(points[1][0], points[1][1]);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(points[0][0], points[0][1], 8, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(points[1][0], points[1][1], 8, 0, 2 * Math.PI);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();

  canvas.addEventListener("click", function () {
    draw();
  });

  function generatePoints() {
    let n = randInt(2, 10);
    let x = Math.floor(700 / (n - 1));
    let result = [];
    for (let i = 0; i < n; i++) {
      result.push([padding + x * i, randInt(padding, height - padding)]);
    }
    return result;
  }

  function draw() {
    // Draw function
    const newPoints = generatePoints();
    let dif = newPoints.length - points.length;
    let moves = [];
    if (dif > 0) {
      moves.push([
        [
          [points[0][0], points[0][1]],
          [newPoints[0][0], newPoints[0][1]],
        ],
        [
          [points[0][0], points[0][1]],
          [newPoints[1][0], newPoints[1][1]],
        ],
      ]);
      for (let i = 1; i < newPoints.length - 2; i++) {
        let x = i;
        if (x > points.length - 1) x = points.length - 1;
        moves.push([
          moves[moves.length - 1][1],
          [
            [points[x][0], points[x][1]],
            [newPoints[i + 1][0], newPoints[i + 1][1]],
          ],
        ]);
      }
      moves.push([
        moves[moves.length - 1][1],
        [
          [points[points.length - 1][0], points[points.length - 1][1]],
          [
            newPoints[newPoints.length - 1][0],
            newPoints[newPoints.length - 1][1],
          ],
        ],
      ]);
    } else if (dif < 0) {
      let i = 0;
      let newI = 0;
      if (dif * -1 >= newPoints.length) {
        const shift = dif * -1 - newPoints.length + 2;
        while (i < shift) {
          moves.push([
            [
              [points[i][0], points[i][1]],
              [newPoints[0][0], newPoints[0][1]],
            ],
            [
              [points[i + 1][0], points[i + 1][1]],
              [newPoints[0][0], newPoints[0][1]],
            ],
          ]);
          i++;
        }
        newI++;
        dif += shift;
      }
      while (newI < dif * -1) {
        if (moves.length == 0)
          moves.push([
            [
              [points[i][0], points[i][1]],
              [newPoints[newI][0], newPoints[newI][1]],
            ],
            [
              [points[i + 1][0], points[i + 1][1]],
              [newPoints[newI][0], newPoints[newI][1]],
            ],
          ]);
        else
          moves.push([
            moves[moves.length - 1][1],
            [
              [points[i + 1][0], points[i + 1][1]],
              [newPoints[newI][0], newPoints[newI][1]],
            ],
          ]);
        moves.push([
          moves[moves.length - 1][1],
          [
            [points[i + 2][0], points[i + 2][1]],
            [newPoints[newI + 1][0], newPoints[newI + 1][1]],
          ],
        ]);
        i += 2;
        newI++;
      }
      while (newI < newPoints.length - 1) {
        moves.push([
          moves[moves.length - 1][1],
          [
            [points[i][0], points[i][1]],
            [newPoints[newI][0], newPoints[newI][1]],
          ],
        ]);
        i++;
        newI++;
      }
      moves.push([
        moves[moves.length - 1][1],
        [
          [points[points.length - 1][0], points[points.length - 1][1]],
          [
            newPoints[newPoints.length - 1][0],
            newPoints[newPoints.length - 1][1],
          ],
        ],
      ]);
    } else {
      for (let i = 0; i < points.length - 1; i++) {
        moves.push([
          [
            [points[i][0], points[i][1]],
            [newPoints[i][0], newPoints[i][1]],
          ],
          [
            [points[i + 1][0], points[i + 1][1]],
            [newPoints[i + 1][0], newPoints[i + 1][1]],
          ],
        ]);
      }
    }
    let step = 0;
    const steps = 20;
    let interval = setInterval(function () {
      if (step == steps) clearInterval(interval);
      ctx.clearRect(0, 0, 800, 400);
      for (let i = 0; i < moves.length; i++) {
        ctx.beginPath();
        ctx.moveTo(
          moves[i][0][0][0] +
            ((moves[i][0][1][0] - moves[i][0][0][0]) * step) / steps,
          moves[i][0][0][1] +
            ((moves[i][0][1][1] - moves[i][0][0][1]) * step) / steps
        );
        ctx.lineTo(
          moves[i][1][0][0] +
            ((moves[i][1][1][0] - moves[i][1][0][0]) * step) / steps,
          moves[i][1][0][1] +
            ((moves[i][1][1][1] - moves[i][1][0][1]) * step) / steps
        );
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
          moves[i][0][0][0] +
            ((moves[i][0][1][0] - moves[i][0][0][0]) * step) / steps,
          moves[i][0][0][1] +
            ((moves[i][0][1][1] - moves[i][0][0][1]) * step) / steps,
          8,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
      }
      let i = moves.length - 1;
      ctx.beginPath();
      ctx.arc(
        moves[i][1][0][0] +
          ((moves[i][1][1][0] - moves[i][1][0][0]) * step) / steps,
        moves[i][1][0][1] +
          ((moves[i][1][1][1] - moves[i][1][0][1]) * step) / steps,
        8,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.stroke();
      step++;
    }, 15);
    points = newPoints;
  }

  function randInt(min, max) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }
});
