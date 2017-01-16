/**
 * react练习
 * @authors Kerry W (wangxuan@eastcom-sw.com)
 * @date    2016-12-09 09:56:51
 * @version $Id$
 */
 var TweetBox = React.createClass({
   getInitialState: function() {
     return {
       text: "",
       photoAdded: false
     };
   },
   handleChange: function(event) {
     this.setState({ text: event.target.value });
   },
   togglePhoto: function(event) {
     this.setState({ photoAdded: !this.state.photoAdded });
   },
   overflowAlert: function() {
     if (this.remainingCharacters() < 0) {
       if (this.state.photoAdded) {
         var beforeOverflowText = this.state.text.substring(140 - 23 - 10, 140 - 23);
         var overflowText = this.state.text.substring(140 - 23);
       } else {
         var beforeOverflowText = this.state.text.substring(140 - 10, 140);
         var overflowText = this.state.text.substring(140);
       }

       return (
         <div className="alert alert-warning">
           <strong>Oops! Too Long:</strong>
           &nbsp;...{beforeOverflowText}
           <strong className="bg-danger">{overflowText}</strong>
         </div>
       );
     } else {
       return "";
     }
   },
   remainingCharacters: function() {
     if (this.state.photoAdded) {
       return 140 - 23 - this.state.text.length;
     } else {
       return 140 - this.state.text.length;
     }
   },
   render: function() {
     return (
       <div className="well clearfix">
         { this.overflowAlert() }
         <textarea className="form-control"
                   onChange={this.handleChange}></textarea>
         <br/>
         <span>{ this.remainingCharacters() }</span>
         <button className="btn btn-primary pull-right"
           disabled={this.state.text.length === 0 && !this.state.photoAdded}>Tweet
         </button>
         <button className="btn btn-default pull-right" onClick={this.togglePhoto}>
           {this.state.photoAdded ? "✓ Photo Added" : "Add Photo" }
         </button>
       </div>
     );
   }
 });

 ReactDOM.render(
   <TweetBox />,
   // document.getElementById('tweet')
   $('#tweet')[0]
 );


 var LikeButton = React.createClass({
   getInitialState: function() {
     return {liked: false};
   },
   handleClick: function(event) {
     this.setState({liked: !this.state.liked});
   },
   render: function() {
     var text = this.state.liked ? 'like' : 'haven\'t liked';
     return (
       <p onClick={this.handleClick}>
         You {text} this. Click to toggle.
       </p>
     );
   }
 });

 ReactDOM.render(
   <LikeButton />,
   document.getElementById('map')
 );

 var Hello = React.createClass({
   getInitialState: function () {
     return {
       opacity: 1.0
     };
   },

   componentDidMount: function () {
     this.timer = setInterval(function () {
       var opacity = this.state.opacity;
       opacity -= .05;
       if (opacity < 0.1) {
         opacity = 1.0;
       }
       this.setState({
         opacity: opacity
       });
     }.bind(this), 1000);
   },

   render: function () {
     return (
       <div style={{opacity: this.state.opacity}}>
         Hello {this.props.name}
       </div>
     );
   }
 });

 ReactDOM.render(
   <Hello name="world"/>,
   document.getElementById('hello')
 );

 var GroceryList = React.createClass({
    handleClick: function(i) {
        console.log('You clicked: ' + this.props.items[i]);
        // console.log('clicked happened on :' + name);
        // console.log(event.target);
    },
    render() {
        return (
          <div>
            {
              this.props.items.map((item, i) => {
                return (
                  <div onClick={this.handleClick.bind(this, i)} >
                    {item}
                  </div>
                );
              })
            }
          </div>
        );
    }
 }); 

 ReactDOM.render(
   <GroceryList items={['','Apple', 'Banana', 'Cranberry']} />, 
   document.getElementById('grocery')
 );


 class DatePrint extends React.Component{
   render() {
     return (
       <p>
         Hello, <input type="text" placeholder="Your name here" />!
         It is {this.props.date.toTimeString()}
       </p>
     );
   }
   getDefaultProps(props) {
      return props;
   }
 };

 var MyDatePrint = DatePrint;
 setInterval(function() {
   ReactDOM.render(
     <MyDatePrint date={new Date()} />,
     document.getElementById('date')
   );
 }, 1000);

 //DEMO
 var SELF_COL;
 var Control = React.createClass({
  areaChangeHandler: function(e) {
      const area = $(e.target).find("option:selected").text();
      console.log(area);
      SELF_COL.onSelectChange(100,area);
  },
  render: function() {
      return (
        <div>
          <input type="radio" checked="checked" />月
          <select onChange={this.areaChangeHandler} >
            <option>上海</option>
            <option>黄浦</option>
            <option>徐汇</option>
          </select>
          <button>查询</button>
        </div>
      );
  }
 });
 class Control1 extends React.Component {
    areaChangeHandler() {
        const area = $('#areaSelect').find("option:selected").text();
        console.log(area);
        SELF_COL.onSelectChange(100,area);
    }
    render() {
        return (
          <div>
            <input type="radio" checked="checked" />月
            <select id="areaSelect">
              <option>上海</option>
              <option>黄浦</option>
              <option>徐汇</option>
            </select>
            <button onClick={this.areaChangeHandler.bind(this)}>查询</button>
          </div>
        );
    }
 };
 var MyControl = Control1; 
 
 var Infos = React.createClass({
  render() {
    return (
        <div>
          <div>
            <button>网络规模</button>
            <button>网络业务量</button>
            <button>LTE专业指标</button>
            <button>TD专业指标</button>
          </div>
          <div><span>{this.props.area}</span> total is <span>{this.props.score}</span></div>
        </div>
    );
  }
 });
 class Infos1 extends React.Component {

    render() {
      return (
          <div>
            <div>
              <button>网络规模</button>
              <button>网络业务量</button>
              <button>LTE专业指标</button>
              <button>TD专业指标</button>
            </div>
            <div><span>{this.props.area}</span> total is <span>{this.props.score}</span></div>
          </div>
      );
    }
 };
 var MyInfos = Infos1;
 var Collection = React.createClass({
    getInitialState: function() {
      SELF_COL = this;
      return {
          score: 500,
          area: '上海'
      }
    },
    onSelectChange(score, area) {
        this.setState({score: score, area: area});
    },
    render() {
        return (
            <div>
              <Control />
              <Infos area={this.state.area} score={this.state.score} />
            </div>
        );
    }
 });
 class Collection1 extends React.Component {
    constructor(props) {
        super(props);
        SELF_COL = this;
        this.state = props;
        // this.state = {
        //     score: 500,
        //     area: '上海'
        // };
    }
    onSelectChange(score, area) {
        this.setState({score: score, area: area});
    }
    render() {
        return (
            <div>
              <MyControl />
              <MyInfos area={this.state.area} score={this.state.score} />
            </div>
        );
    }
 };
 var MyCollection = Collection1;
 ReactDOM.render(
   <MyCollection area="上海" score="500" />,
   $('#control')[0]
 );