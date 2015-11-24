var NewPostForm = NewPostForm || {};

(function() {
  "use strict";
  NewPostForm = React.createClass({

    getInitialState: function() {
      return {
        key: Immutable.Map({isActive: false, value: "", validationMessage: ""}),
        categories: Immutable.List(),
        activeTab: 0,
      };
    },

    componentDidMount: function() {
      this._focusKeyInput();
    },

    componentDidUpdate: function() {
      this._initNavTabEventListeners();
    },

    render: function() {
      var keyValidationMessageClass = this.state.key.get('isActive') ? "text-success" : "text-danger";
      var tabNodes = this._tabNodes();
      var tabContentNodes = this._tabContentNodes();
      return (
        <div>
          <div id="key-input-container" className="col-md-4 col-md-offset-4">
            <div className="">
              <input type="text"
                     value={this.state.key.get('value')}
                     onChange={this._onKeyChange}
                     className="form-control" id="key"
                     placeholder="Enter Key" />
              <div className={keyValidationMessageClass}>{this.state.key.get('validationMessage')}</div>
            </div>
          </div>

          <div id="post-form-container" className="col-md-8 col-md-offset-2">
            <ul className="nav nav-tabs" role="tablist">
              {tabNodes}
            </ul>

            <div className="tab-content">
              {tabContentNodes}
            </div>
          </div>
        </div>
      );
    },

    _tabNodes: function() {
      var that = this;
      var result = this.state.categories.map(function(category, index) {
        var className = that.state.activeTab === index ? "active" : "";
        var href = "#category-" + index;
        return(
          <li key={index} role="presentation" className={className}>
            <a href={href} role="tab" data-toggle="tab">{category.get('tab_name')}</a>
          </li>
        );
      });
      return result;
    },

    _tabContentNodes: function() {
      var that = this;
      var result = this.state.categories.map(function(category, index) {
        var className = that.state.activeTab === index ? "tab-pane active" : "tab-pane";
        var id = "category-" + index;
        var inputId = id + "-input";
        var inputVal = category.get('post');
        return(
          <div role="tabpanel" className={className} id={id} key={index}>
            <h3>{category.get('prompt')}</h3>
            <label htmlFor={inputId}>{category.get('prompt')}</label>
            <textarea className="form-control" id={inputId} name={inputId} value={inputVal} onChange={that._onPostChange.bind(that, index)} />
            <button className="btn btn-primary" type="button" onClick={that._onSubmit.bind(that, index)}>Submit</button>
          </div>
        );
      });
      return result;
    },

    _onKeyChange: function(event) {
      var that = this;
      var key = event.target.value;
      var goodKeyMessage = "Good Key!";
      var badKeyMessage = "Bad Key :(";
      if (key.length >= 4) {
        $.ajax({
          url: "/posts/validate_key",
          type: "GET",
          data: {key: key},
          success: function(response) {
            var validationMessage = response.isActive ? goodKeyMessage : badKeyMessage;
            var newState = ({
              key: Immutable.Map({
                     value: response.key,
                     isActive: response.isActive,
                     validationMessage: validationMessage,
                   }),
              categories: that.getInitialState().categories,
            });

            if(response.categories) {
              newState.categories = Immutable.fromJS(response.categories);
            }

            that.setState(newState);
          },
          error: function(response) {
            //handle error
          }
        });
      } else {
        that.setState({
          key: Immutable.Map({
            value: key,
            isActive: false,
            validationMessage: badKeyMessage,
          })
        });
      }
    },

    _onSubmit: function(index, event) {
      var categoryId = this.state.categories.get(index).get('id');
      var postBody = this.state.categories.get(index).get('post');
      var data = { category_id: categoryId, post_body: postBody };

      $.ajax({
        type: "POST",
        url: "/posts",
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8"
      });
    },

    _onPostChange: function(index, event) {
      var newValue = this.state.categories.get(index).set('post', event.target.value);
      var newState = { categories: this.state.categories.set(index, newValue) };
      this.setState(newState);
    },

    _focusKeyInput: function() {
      $('#key-input-container input').focus();
    },

    _initNavTabEventListeners: function() {
      var that = this;
      $('#post-form-container .nav-tabs a').click(function(e) {
        e.preventDefault();
        $(this).tab('show');
      });
    },
  });
})();
