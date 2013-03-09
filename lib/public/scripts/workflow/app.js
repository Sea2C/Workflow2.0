(function ($, Backbone, dust, moment) {

    // todo: figure out a better way to do templates
    var Templates = {
        load: function (url, callback) {
            $.ajax({
                url: url,
                method: 'GET',
                async: false,
                complete: function (xhr, status) {
                    callback(xhr.responseText);
                }
            });
        },
        get: function (name, url, callback) {
            var me = this,
                remotes = {},
                templates = (me.templates = me.templates || {});

            if (typeof url === 'function') {
                callback = url;
                remotes = name;
            } else {
                remotes[name] = url;
            }

            (function load(names) {
                var name = names.shift();
                
                if (!name) {
                    return callback();
                } else if (!(template = templates[name])) {
                    me.load(remotes[name], (function (n, v) {
                        return function (template) {
                            templates[n] = template;
                            dust.loadSource(dust.compile(template, n));
                            load(v);
                        };
                    } (name, names)));
                } else {
                    load(names);
                }
            } (Object.keys(remotes)));
        }
    };

    var Appointment = Backbone.Model.extend({
        urlRoot: '/appointments'
    });

    var AppointmentCollection = Backbone.Collection.extend({
        model: Appointment,
        url: '/appointments'
    });

    var AppointmentViewModel = Appointment.extend({
        initialize: function (attributes) {
            var m,
                date,
                offset,
                me = this;
            
            if ((date = attributes.date)) {
                m = moment(date);
                me.set({
                    date: m.format('YYYY-MM-DD'),
                    datetime: attributes.date,
                    time: m.format('HH:mm')
                });
            }
        }
    });

    var AppointmentListViewModel = Appointment.extend({
        initialize: function(attributes){
            var m,
                date,
                offset,
                me = this;
            
            if ((date = attributes.date)) {
                m = moment(date);
                me.set({
                    date: m.format('YYYY-MM-DD'),
                    datetime: attributes.date,
                    time: m.format('HH:mm')
                });
            }
        }
    });

    var AppointmentListViewModelCollection = AppointmentCollection.extend({
        model: AppointmentListViewModel
    });

    var ModelListView = Backbone.View.extend({
        className: 'row-fluid', 
        render: function () {
            var me = this,
                context = me.createTemplateContext();

            dust.render(me.template, context, function (error, output) {
                if (error) {
                    me.trigger('error', error);
                    return;
                }

                $(me.el).html(output);
            });

            return me;
        },
        createTemplateContext: function () {
            var context,
                me = this,
                model = me.model.toJSON(),
                collection = me.collection;

            if (typeof collection === 'string') {
                context = {};
                context[collection] = model;
            } else {
                context = model;
            }

            return context;
        }
    });

    var AppointmentList = ModelListView.extend({
        collection: 'appointments',
        template: 'appointmentList',
        events: { 
            'click .appointment-list-row': 'rowClick',
            'click .delete': 'deleteRow'
        },
        deleteRow: function(e){
            var currentId = $(e.currentTarget).closest('tr').attr('data-row');
            this.trigger('delete',currentId);
            return false;
        },
        rowClick: function(e){
            var currentId = e.currentTarget.attributes['data-row'].value;
            this.trigger('navigate',currentId);
        }
    });

    var AppointmentView = Backbone.View.extend({
        events: {
            "click .submit": 'submit'
        },
        render: function () {
            var me = this,
                model = me.model.toJSON();
            
            dust.render('appointment', model, function (error, output) {
                if (error) {
                    console.log(arguments);
                    alert('An unexpected rendering error has occurred');
                    return;
                }

                $(me.el).html(output);
            });

            return me;
        },
        submit: function () {
            var me = this,
                model = me.model;

            model.set(me.serialize());

            model.save(model.toJSON(),{
                success: function (){
                    me.trigger('navigate');
                }
            });
        },
        serialize: function () {
            var me = this,
                m = moment(me.$('#date').val()),
                time = me.$('#time').val().split(':');

            m.hours(+time[0]);
            m.minutes(+time[1]);

            return {
                title: me.$('#title').val(),
                date: m.utc().format(),
                description: me.$('#description').val(),
                timezoneOffset: (new Date()).getTimezoneOffset()
            };
        }
    });

    var Router = Backbone.Router.extend({
        selector: '#content',
        replace: function (content) {
            var me = this,
                target = (me.target = me.target || $(me.selector));

            target.html(content.$el || content);
        }
    });

    var AppointmentRouter = Router.extend({
        routes: {
            'appointments': 'list',
            'appointments/create': 'create',
            'appointments/:id': 'view'
        },
        create: function () {
            var me = this,
                view = new AppointmentView({
                    model: new Appointment()
                }).render();

            view.on('navigate',function () {
                me.navigate('/appointments', true);
            });

            me.replace(view);
        },
        list: function(){
            var me = this,
                model = new AppointmentListViewModelCollection();

            model.fetch({
                success: function () {
                    var view = new AppointmentList({
                        model: model
                    }).render();

                    view.on('navigate',function (id) {
                        me.navigate('/appointments/' + id, true);
                    });

                    view.on('delete',function (id) {
                        var modelToDelete = new Appointment({ id: id});
                        modelToDelete.destroy({
                            success: function(){
                                me.list();
                            }
                        });
                    });

                    // todo: revisit this for our date and time overrides
                    me.replace(view);
                }
            });
        },
        view: function (id) {
            var me = this,
                model = new Appointment({ id: id });
            
            model.fetch({
                success: function () {
                    // todo: revisit this for our date and time overrides
                    var view = new AppointmentView({
                        model: new AppointmentViewModel(model.attributes)
                    }).render();

                    view.on('navigate', function () {
                        me.navigate('/appointments', true);
                    });

                    me.replace(view);
                }
            });
        }
    });

    var User = Backbone.Model.extend({
        urlRoot: '/users'
    });

    var UserCollection = Backbone.Collection.extend({
        model: User,
        url: '/users'
    });

    var UserListView = ModelListView.extend({
        collection: 'users',
        template: 'userList',
        events: {
            'click .btn': 'edit'
        },
        edit: function (e) {
            var me = this,
                id = $(e.currentTarget).closest('tr').attr('data-row');
            me.trigger('edit', this.model.get(id), id);
        }
    });

    var UserEditView = Backbone.View.extend({
        events: {
            'click .btn-primary': 'save',
            'click button.remove': 'remove'
        },
        render: function () {
            var me = this,
                model = me.model.toJSON();
            
            dust.render('userEdit', model, function (error, output) {
                var $el;

                if (error) {
                    console.log(arguments);
                    alert('An unexpected rendering error has occurred');
                    return;
                }

                $el = $(me.el).html(output);
                $el.find('select').val(model.role);
                $el.modal();
            });

            return me;
        },
        save: function () {
            var me = this,
                model = me.model;
            
            model.set({ role: $(me.el).find('select').val() });

            model.save(model.toJSON(),{
                success: function (){
                    me.trigger('save');
                    me.$el.modal('hide');
                }
            });
        }
    });

    var UserRouter = Router.extend({
        routes: {
            'users': 'list'
        },
        list: function () {
            var me = this,
                model = new UserCollection();

            model.fetch({
                success: function () {
                    var view = new UserListView({
                        model: model
                    }).render();

                    view.on('edit', function (user, id) {
                        var editView = new UserEditView({
                            model: user
                        }).render();

                        editView.on('save', function () {
                            editView.$el.modal('hide');
                            editView.remove();
                            me.list();
                        });
                    });

                    me.replace(view);
                }
            });
        }
    });

    Templates.get({
        appointment: 'templates/appointments/view.dust',
        appointmentList: 'templates/appointments/list.dust',
        userList: 'templates/users/list.dust',
        userEdit: 'templates/users/edit.dust'
    }, function () {
        $(function () {
            var userRouter = new UserRouter(),
                appointmentRouter = new AppointmentRouter();
            Backbone.history.start({ pushState: false, root: '/app' });
            userRouter.navigate('users', true);
        });
    });

} (window.jQuery || window.Zepto, window.Backbone, window.dust, window.moment));