cmake_minimum_required(VERSION 2.8.3)
project(maestro_i2c)

find_package(catkin REQUIRED COMPONENTS
  roscpp
  rospy
  std_msgs
)

catkin_package()

include_directories(
  /root/mraa/api
  usr/include
  ${catkin_INCLUDE_DIRS}
)

add_executable(maestro_i2c maestro_i2c.cpp)
target_link_libraries(maestro_i2c
  /root/mraa/build/src/libmraa.so
  ${catkin_LIBRARIES}
)
add_dependencies(
  maestro_i2c maestro_i2c_gencpp
  ${catkin_EXPORTED_TARGETS}
)
