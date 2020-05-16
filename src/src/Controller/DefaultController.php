<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Mercure\Jwt\StaticJwtProvider;
use Symfony\Component\Mercure\Publisher;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;

/**
 * Class DefaultController
 * @package App\Controller
 */
class DefaultController extends AbstractController
{
    /**
     * @param string $hash
     *
     * @return Response
     */
    public function play(string $hash)
    {
        return $this->render('base.html.twig');
    }

    /**
     * @param string $hash
     *
     * @param Request $request
     * @param PublishController $publishController
     * @return Response
     */
    public function status(string $hash, Request $request, PublishController $publishController)
    {
        $content = $request->getContent();

        $publishController->__invoke();

        return $this->json([]);
    }
}
