import React from 'react';
import classes from './AboutPage.scss';
import Showdown from 'showdown';
import AsyncComponent from '../../containers/commons/AsyncComponent';
import { getStore } from '../../redux/store';
import { createModuleLoader } from '../../plugins';


const converter = new Showdown.Converter();

const whoAmI =
  `My name is Chen Fang, a **Full-Stack Software Engineer**.
  I'm an **passionate adventurer** finding the truth of the meaningful life.
  I'm an **unfulfilled educator** telling his bumpy story to the youth who
  are looking for an answer to their life that they shouldn't be answered by
  themselves by suffering through all the unnecessary pains.`;

class AboutView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pluginId: 'controlPanel'
    };
  }

  render() {
    const { pluginId } = this.state;
    const store = getStore();

    return (
      <article className={classes.container}>
        {pluginId && <AsyncComponent moduleLoader={createModuleLoader(store, pluginId)} />}
        <main>
          <section>
            <h3 className={classes.title}>Me</h3>
            <p className={classes.main}
               dangerouslySetInnerHTML={{ __html: converter.makeHtml(whoAmI) }}>
            </p>
          </section>
        </main>
      </article>
    );
  }
}

export default AboutView;
