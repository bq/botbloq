#!/usr/bin/env python

import sys
import rospy
from comm_bridge.srv import *


def get_acc_client():
    rospy.wait_for_service('get_acc')
    try:
        get_acc = rospy.ServiceProxy('get_acc', GetAcc)
        resp1 = get_acc()
        return resp1.respond
    except rospy.ServiceException, e:
        print "Service call failed: %s" % e


def usage():
    return "%s [x y]" % sys.argv[0]


if __name__ == "__main__":
    print "Requesting"
    print get_acc_client()
