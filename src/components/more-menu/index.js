    import { createElement, Component, render } from 'preact';
import { withIntl } from '../../enhancers';
import style from './style';
import { Button } from '@zimbra-client/blocks';
import { withText } from 'preact-i18n';

/* Depends: https://github.com/Zimbra/zm-x-web/pull/2963 */

@withIntl()
@withText({
    title: 'zm-x-zimlet-appointment.title',
    dialInText: 'zm-x-zimlet-appointment.dialInText',
})
export default class MoreMenu extends Component {
    constructor(props) {
        super(props);
        this.zimletContext = props.children.context;
    };


    handleClick = e => {
      //console.log(this.props);
      //handleLocationChange is a method passed (via props) to the Zimlet slot that allows you to set the location of the appointment
      this.props.handleLocationChange({ value: ['A location (https://yourVideoConferenceApp.example.coms) can be inserted here'] });
      
      //Use dispatch/setEvent to set the notes field of the appointment.
      const { dispatch } = this.zimletContext.store;
      const { setEvent } = this.zimletContext.zimletRedux.actions.calendar;

      //this.props.notes (is a prop passed via the Zimlet slot) that holds the content of the notes field (at the time the user clicks the Zimlet button)
      //It may have user added content.
      //With setEvent the developer can append/prepend or replace (to) the users notes.
      
      //this.props.tabId is a prop that holds the Id of the current UI tab (it is also visible in the address bar of the browser, 
      //https://example.com/calendar/event/new?tabid=1599042149583)

      //to set the notes field:
      dispatch(
         setEvent({
            tabId: this.props.tabId,
            eventData: {
               notes: 'Body text can be set here '+this.props.dialInText + ' ' + this.props.notes,
               isFormDirty: true
            }
         })
      );

      //Alternatively, if you really must you can also interact with TinyMCE directly, but this is NOT recommended:
      //parent.window.tinymce.get('zimbra-notes-' + this.props.tabId).execCommand('mceInsertContent', false, this.props.dialInText + 'someMoreText');
    }

    render() {
        const childIcon = (
            <span class={style.appIcon}>
            </span>);

        return (
            <Button
                class={style.button}
                onClick={this.handleClick}
                brand="primary"
                icon={childIcon}
            >
                {this.props.title}
            </Button>
        );
    }
}
