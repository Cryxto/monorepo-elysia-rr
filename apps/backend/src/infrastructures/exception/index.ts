export class ForbiddenError extends Error {
  status = 403;

  constructor(public message: string = 'Forbidden') {
    super(message);
  }

  toResponse() {
    return Response.json(
      {
        error: this.message,
        code: this.status,
      },
      {
        status: this.status,
      },
    );
  }
}

export class UnauthorizedError extends Error {
  status = 401;

  constructor(public message: string = 'Unauthorized') {
    super(message);
  }

  toResponse() {
    return Response.json(
      {
        error: this.message,
        code: this.status,
      },
      {
        status: this.status,
      },
    );
  }
}

export class NotFoundError extends Error {
  status = 404;

  constructor(public message: string = 'Not Found') {
    super(message);
  }

  toResponse() {
    return Response.json(
      {
        error: this.message,
        code: this.status,
      },
      {
        status: this.status,
      },
    );
  }
}

export class UnprocessableEntityError extends Error {
  status = 422;

  constructor(public message: string = 'Unprocessable Entity') {
    super(message);
  }

  toResponse() {
    return Response.json(
      {
        error: this.message,
        code: this.status,
      },
      {
        status: this.status,
      },
    );
  }
}
