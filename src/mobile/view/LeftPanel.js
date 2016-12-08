import React, { Component } from 'react'

class LeftPanel extends Component {
	render(){
		return (

	<div className="panel panel-left panel-cover sidebar">
	    <div className="view">
	    <div className=" ">
	      <div data-page="panel-left" className="sidemenu leftmenusmall gradient">
	        <div className="item-content userprofile">
                <div className="item-media"><img src="/mobile/img/pic1.png" width="44" alt=""/></div>
                <div className="item-inner">
                  <div className="item-title-row">
                    <div className="item-title">Max Smith</div>
                  </div>
                  <div className="item-subtitle">India</div>
                </div>
	        </div>

	        <div className="page-content">
	            <div className="list-block accordion-list">
	              <ul className="menu">
	               <li className="accordion-item"><a href="#" className="item-content item-link">
	                    <div className="item-inner">
	                      <div className="item-title"><i className="fa fa-tasks"></i>Menu</div>
	                    </div></a>
	                  <div className="accordion-item-content">
	                    <div className="content-block">
	                        <ul>
	                            <li><a href="#" data-panel="left" className="item-link  close-panel"><span>This is overlay</span></a></li>
	                            <li><a href="#" data-panel="right" className="item-link open-panel"><span>Reavel Sidemenu</span></a></li>
	                            <li><a href="todo.html" className="item-link close-panel"><span>Floating Speed Dial</span></a></li>
	                            <li><a href="landing.html" className="item-link close-panel"><span>Landing</span></a></li>
	                        </ul>
	                    </div>
	                  </div>
	                </li>
	                  
	                  
	                <li className="accordion-item"><a href="#" className="item-content item-link">
	                    <div className="item-inner">
	                      <div className="item-title"><i className="fa fa-home"></i>Home</div>
	                    </div></a>
	                  <div className="accordion-item-content">
	                    <div className="content-block">
	                        <ul>
	                            <li><a href="home.html" className="item-link close-panel"><span>Cover Slider</span></a></li>
	                            <li><a href="home_classic.html" className="item-link close-panel"><span>Classic</span></a></li>                            
	                            <li><a href="home_dashboard.html" className="item-link close-panel"><span>Dashboard</span></a></li>
	                            <li><a href="home_reader.html" className="item-link close-panel"><span>Reader Home</span></a></li>
	                            <li><a href="home_shop.html" className="item-link close-panel"><span>Shop</span></a></li>
	                        </ul>
	                    </div>
	                  </div>
	                </li>
	                <li className="accordion-item"><a href="#" className="item-content item-link">
	                    <div className="item-inner">
	                      <div className="item-title"><i className="fa fa-heart"></i>About</div>
	                    </div></a>
	                  <div className="accordion-item-content">
	                    <div className="content-block">
	                        <ul>
	                            <li><a href="about.html" className="item-link close-panel"><span>About</span></a></li>
	                        </ul>
	                    </div>
	                  </div>
	                </li>
	                <li className="accordion-item"><a href="#" className="item-content item-link">
	                    <div className="item-inner">
	                      <div className="item-title"><i className="fa fa-briefcase"></i>Services</div>
	                    </div></a>
	                  <div className="accordion-item-content">
	                    <div className="content-block">
	                        <ul>
	                            <li><a href="services.html" className="item-link close-panel"><span>Services</span></a></li>
	                        </ul>
	                    </div>
	                  </div>
	                </li>
                  
	              </ul>
	            </div>         
	        </div>        
	      </div>
	    </div>
	  </div>
	</div>

		)
	}
}

export default LeftPanel