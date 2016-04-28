#!/usr/bin/env python
import rospy
from comm_bridge.srv import *
from std_msgs.msg import *

import logging.config
from tornado import web, ioloop

from wshubsapi import asynchronous
from wshubsapi.hubs_inspector import HubsInspector
from wshubsapi.connection_handlers.tornado_handler import ConnectionHandler
from wshubsapi.hub import Hub

logging.basicConfig(level=logging.DEBUG)
log = logging.getLogger("ros")
logging.getLogger('root').setLevel(logging.DEBUG)

app = web.Application([
    (r'/(.*)', ConnectionHandler),
])


class TopicsManager(Hub):
    def __init__(self):
        super(TopicsManager, self).__init__()
        self.publisher = None

    def publish(self, message, *args, **kwargs):
        hello_str = "hello world %s" % rospy.get_time()
        rospy.loginfo(hello_str)
        self.publisher.publish(message)

    def service(self, req):
        if 1 in self.clients.all_connected_clients:
            client = self.clients.get(1)
            acc = client.get_acceleration().result(timeout=5)
            return GetAccResponse([acc["x"], acc["y"], acc["z"]])

    @staticmethod
    def static_func():
        pass

    @classmethod
    def class_method(cls):
        pass


@asynchronous.asynchronous()
def init_server():
    HubsInspector.inspect_implemented_hubs()
    # HubsInspector.construct_js_file(settings["static_path"])
    # HubsInspector.construct_python_file(settings["static_path"])
    log.debug("starting...")
    app.listen(8888)

    ioloop.IOLoop.instance().start()


def talker():
    rospy.init_node('ws_bridge', anonymous=True)
    HubsInspector.inspect_implemented_hubs()
    hub = HubsInspector.get_hub_instance(TopicsManager)
    ''' :type : TopicsManager'''

    pub = rospy.Publisher('chatter', String, queue_size=10)
    s = rospy.Service('get_acc', GetAcc, hub.service)
    hub.publisher = pub


if __name__ == '__main__':
    init_server()
    talker()
    rospy.spin()
