import React, { Component } from 'react'

class RightPanel extends Component {
	render(){
		return (

	<div className="panel panel-right panel-reveal sidebar">
	  <div className="view">
	    <div className=" ">
	      <div data-page="panel-left" className="sidemenu leftmenusmall gradient">
	        <div className="item-content userprofile">
	                <div className="item-media"><img src="/mobile/img/pic1.png" width="44"  alt="The Varsity" /></div>
	                <div className="item-inner">
	                  <div className="item-title-row">
	                    <div className="item-title">Max Smith</div>
	                  </div>
	                  <div className="item-subtitle">India</div>
	                </div>
	        </div>
	        <div className="page-content">
	            <div className="inputs-list content-block" >
	                  <h2 className="maintitle  center">Contact us</h2>
	                    <p className="center" >We will be back on your provided email address</p>
	              </div>
	              <div className="list-block">
	                  <ul>
	                  <li>
	                    <div className="item-content">
	                      <div className="item-inner">
	                        <div className="item-title label">Your name</div>
	                        <div className="item-input">
	                          <input type="text" placeholder="" />
	                        </div>
	                      </div>
	                    </div>
	                  </li>
	                  <li>
	                    <div className="item-content">
	                      <div className="item-inner">
	                        <div className="item-title label">E-mail</div>
	                        <div className="item-input">
	                          <input type="email" placeholder="" />
	                        </div>
	                      </div>
	                    </div>
	                  </li>
	                  <li>
	                    <div className="item-content">
	                      <div className="item-inner">
	                        <div className="item-title label">Phone</div>
	                        <div className="item-input">
	                          <input type="tel" placeholder=""/>
	                        </div>
	                      </div>
	                    </div>
	                  </li>
	                  <li className="align-top">
	                    <div className="item-content">
	                      <div className="item-inner">
	                        <div className="item-title label">Message/Queries</div>
	                        <div className="item-input">
	                          <textarea className="resizable"></textarea>
	                        </div>
	                      </div>
	                    </div>
	                  </li>
	                </ul>
	                </div>
	         
	        </div>

	         <div className="buttonbar row no-gutter">
	            <a href="contactus.html" className=" button button-fill col-100 close-panel">Locate Us</a>
	        </div>
	      </div>
	    </div>
	  </div>
	</div>

		)
	}
}

export default RightPanel