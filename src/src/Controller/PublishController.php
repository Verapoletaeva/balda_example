<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
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
        $update = new Update(
            'http://example.com/books/1',
            json_encode(['status' => 'OutOfStock'])
        );

        // The Publisher service is an invokable object
        $publisher($update);

        return new Response('published!');
//        dump(get_class($publisher));
//        dump($router->generate('play', ['hash' => $hash], UrlGeneratorInterface::ABSOLUTE_URL));
//        $update = new Update(
//            $router->generate('play', ['hash' => $hash], UrlGeneratorInterface::ABSOLUTE_URL),
//            $router->generate('play', ['hash' => $hash], UrlGeneratorInterface::ABSOLUTE_URL)
////            $request->getContent()
//        );
//        dump($update->getTopics(), $update->getData());
//
//        // The Publisher service is an invokable object
//        $publisher($update);
//
//        $response = new Response();
//        $response->headers->set('mercure', ['subscribe' => ["http://tuto.my-website.fr/user/{$user->getId()}"]]);
    }
}