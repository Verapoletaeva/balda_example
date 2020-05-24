<?php

namespace App\Controller;

use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mercure\PublisherInterface;
use Symfony\Component\Mercure\Update;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * Class PublishController
 * @package App\Controller
 */
class PublishController extends AbstractController
{
    /**
     * @param string $hash
     * @param PublisherInterface $publisher
     * @param Request $request
     * @param UrlGeneratorInterface $router
     *
     * @return Response
     */
    public function publish(string $hash, PublisherInterface $publisher, Request $request, UrlGeneratorInterface $router): Response
    {
        $body = json_decode($request->getContent(), true);
        $update = new Update(
            $router->generate('play', ['hash' => $hash], UrlGeneratorInterface::ABSOLUTE_URL),
            json_encode($body)
        );

        try {
            $publisher($update);
        } catch (Exception $exception) {
            return $this->json(['message' => "Failed to update status."], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return $this->json([]);
    }
}