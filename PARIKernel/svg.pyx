#
# Helper module to handle SVG images produced by PARI
#
# Copyright (C) 2017 Jeroen Demeyer
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#


from .paridecl cimport *

cdef pari_kernel

cdef void svg_callback(const char* svg) nogil:
    with gil:
        pari_kernel.publish_svg(svg, 480, 320)


def init_svg(kernel):
    global pari_kernel
    global cb_plot_svg
    pari_kernel = kernel

    init_graph()
    PARI_get_plot_svg()
    cb_plot_svg = svg_callback
