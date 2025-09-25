// src/utils/errors.js

// Classe de base pour toutes nos erreurs HTTP
class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

// Erreur pour une requête invalide (400)
export class HttpBadRequest extends HttpError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

// Erreur pour une ressource non trouvée (404)
export class HttpNotFound extends HttpError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

// Erreur pour un accès interdit (403) - utilisée dans l'exercice 1
export class HttpForbidden extends HttpError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}
