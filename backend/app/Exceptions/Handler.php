<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontReport = [
    ];

    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->renderable(function (ValidationException $e, $request) {
            if ($this->isApiRequest($request)) {
                return $this->buildJsonResponse(
                    'Error de validación',
                    $e->errors(),
                    Response::HTTP_UNPROCESSABLE_ENTITY
                );
            }
        });

        $this->renderable(function (Throwable $e, $request) {
            if ($this->isApiRequest($request)) {
                return $this->buildJsonResponse(
                    config('app.debug') ? $e->getMessage() : 'Error del servidor',
                    [],
                    $this->getStatusCode($e)
                );
            }
        });

        $this->reportable(function (Throwable $e) {
        });
    }

    protected function isApiRequest($request): bool
    {
        return $request->is('api/*') || $request->expectsJson();
    }

    protected function buildJsonResponse(string $message, array $errors, int $statusCode)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $statusCode);
    }

    protected function getStatusCode(Throwable $e): int
    {
        if (method_exists($e, 'getStatusCode')) {
            return $e->getStatusCode();
        }

        if ($e instanceof ValidationException) {
            return Response::HTTP_UNPROCESSABLE_ENTITY;
        }

        return Response::HTTP_INTERNAL_SERVER_ERROR;
    }
}